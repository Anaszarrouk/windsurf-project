import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ScreeningStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Screening {
  id: string;
  startsAt: string;
  endsAt: string;
  room: string;
  capacity: number;
  ticketsSold: number;
  status: ScreeningStatus;
  movieId: string;
  movie?: { id: string; title: string; duration?: number; poster?: string };
}

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  private apiUrl = 'http://localhost:3000/v2/screenings';

  constructor(private http: HttpClient) {}

  getScreenings(movieId?: string): Observable<{ data: Screening[] }> {
    const url = movieId ? `${this.apiUrl}?movieId=${encodeURIComponent(movieId)}` : this.apiUrl;
    return this.http.get<{ data: Screening[] }>(url);
  }

  getToday(): Observable<{ data: Screening[] }> {
    return this.http.get<{ data: Screening[] }>(`${this.apiUrl}/today`);
  }

  createScreening(payload: Partial<Screening>): Observable<{ data: Screening }> {
    return this.http.post<{ data: Screening }>(this.apiUrl, payload);
  }

  updateScreening(id: string, payload: Partial<Screening>): Observable<{ data: Screening }> {
    return this.http.patch<{ data: Screening }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteScreening(id: string): Observable<{ data: unknown }> {
    return this.http.delete<{ data: unknown }>(`${this.apiUrl}/${id}`);
  }
}
