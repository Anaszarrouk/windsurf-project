import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface ApiResponse<T> {
  data: T;
}

export interface ReviewUser {
  id: string;
  username: string;
  email: string;
  role: string;
  banned?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  movieId: string;
  userId: string;
  user?: ReviewUser;
  createdAt: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiBase = 'http://localhost:3000/v2/movies';

  constructor(private http: HttpClient) {}

  getReviews(movieId: string): Observable<Review[]> {
    return this.http
      .get<ApiResponse<Review[]>>(`${this.apiBase}/${movieId}/reviews`)
      .pipe(map((r) => r.data));
  }

  createReview(movieId: string, payload: CreateReviewPayload): Observable<Review> {
    return this.http
      .post<ApiResponse<Review>>(`${this.apiBase}/${movieId}/reviews`, payload)
      .pipe(map((r) => r.data));
  }

  getSummary(movieId: string): Observable<{ avgRating: number; reviewCount: number }> {
    return this.http
      .get<ApiResponse<{ avgRating: number; reviewCount: number }>>(`${this.apiBase}/${movieId}/reviews/summary`)
      .pipe(map((r) => r.data));
  }
}
