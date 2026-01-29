import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TaskStatus = 'En attente' | 'En cours' | 'Finalisé';

export interface Task {
  id: string;
  name: string;
  description?: string;
  date?: string;
  status: TaskStatus;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<{ data: Task[] }> {
    return this.http.get<{ data: Task[] }>(this.apiUrl);
  }

  getTask(id: string): Observable<{ data: Task }> {
    return this.http.get<{ data: Task }>(`${this.apiUrl}/${id}`);
  }

  createTask(payload: Partial<Task>): Observable<{ data: Task }> {
    return this.http.post<{ data: Task }>(this.apiUrl, payload);
  }

  updateTask(id: string, payload: Partial<Task>): Observable<{ data: Task }> {
    return this.http.patch<{ data: Task }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTask(id: string): Observable<{ data: unknown }> {
    return this.http.delete<{ data: unknown }>(`${this.apiUrl}/${id}`);
  }
}
