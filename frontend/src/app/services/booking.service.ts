import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type BookingStatus = 'paid' | 'cancelled' | 'refunded';

export interface Booking {
  id: string;
  userId: string;
  screeningId: string;
  seatsCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; username: string; email: string; role: string };
  screening?: {
    id: string;
    startsAt: string;
    endsAt: string;
    room: string;
    capacity: number;
    ticketsSold: number;
    status: string;
    movie?: { id: string; title: string; price?: number };
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/v2/bookings';

  constructor(private http: HttpClient) {}

  createBooking(payload: { screeningId: string; seatsCount: number }): Observable<{ data: Booking }> {
    return this.http.post<{ data: Booking }>(this.apiUrl, payload);
  }

  getMyBookings(): Observable<{ data: Booking[] }> {
    return this.http.get<{ data: Booking[] }>(`${this.apiUrl}/me`);
  }

  getBookings(date?: string): Observable<{ data: Booking[] }> {
    const url = date ? `${this.apiUrl}?date=${encodeURIComponent(date)}` : this.apiUrl;
    return this.http.get<{ data: Booking[] }>(url);
  }

  cancelBooking(id: string, status: 'cancelled' | 'refunded' = 'cancelled'): Observable<{ data: Booking }> {
    return this.http.patch<{ data: Booking }>(`${this.apiUrl}/${id}/cancel`, { status });
  }

  deleteBooking(id: string): Observable<{ data: unknown }> {
    return this.http.delete<{ data: unknown }>(`${this.apiUrl}/${id}`);
  }
}
