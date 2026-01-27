import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.refreshSession$().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      },
    });
  }

  refreshSession$(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/profile`).pipe(
      map((res) => res.data),
      tap((user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((res) => res.data),
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      map((res) => res.data),
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/logout`, {}).pipe(
      map((res) => res.data),
      tap(() => {
        localStorage.removeItem('access_token');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }),
    );
  }
}
