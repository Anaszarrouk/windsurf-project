import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  banned?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ data: AdminUser[] }> {
    return this.http.get<{ data: AdminUser[] }>(`${this.apiUrl}/users`);
  }

  updateRole(userId: string, role: string): Observable<{ data: AdminUser }> {
    return this.http.patch<{ data: AdminUser }>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  setBanned(userId: string, banned: boolean): Observable<{ data: AdminUser }> {
    return this.http.patch<{ data: AdminUser }>(`${this.apiUrl}/users/${userId}/ban`, { banned });
  }

  resetPassword(userId: string, newPassword: string): Observable<{ data: { message: string } }> {
    return this.http.post<{ data: { message: string } }>(`${this.apiUrl}/users/${userId}/reset-password`, { newPassword });
  }
}
