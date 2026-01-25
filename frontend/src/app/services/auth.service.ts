import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
