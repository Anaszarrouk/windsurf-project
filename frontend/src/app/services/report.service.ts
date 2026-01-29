import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  data: T;
}

export type ReportCategory = 'bug' | 'payment' | 'content' | 'other';
export type ReportStatus = 'open' | 'resolved';

export interface Report {
  id: string;
  category: ReportCategory;
  message: string;
  status: ReportStatus;
  movieId: string | null;
  reviewId: string | null;
  userId: string;
  user?: { id: string; username: string; email: string; role: string };
  resolvedByUserId: string | null;
  resolvedByUser?: { id: string; username: string; email: string; role: string } | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportPayload {
  category: ReportCategory;
  message: string;
  movieId?: string;
  reviewId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/reports';

  constructor(private http: HttpClient) {}

  createReport(payload: CreateReportPayload): Observable<Report> {
    return this.http.post<ApiResponse<Report>>(this.apiUrl, payload).pipe(map((r) => r.data));
  }

  listReportsForStaff(): Observable<Report[]> {
    return this.http.get<ApiResponse<Report[]>>(this.apiUrl).pipe(map((r) => r.data));
  }

  resolveReport(id: string): Observable<Report> {
    return this.http.patch<ApiResponse<Report>>(`${this.apiUrl}/${id}/resolve`, {}).pipe(map((r) => r.data));
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map((r) => r.data));
  }
}
