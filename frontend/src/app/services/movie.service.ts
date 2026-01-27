import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Movie {
  id: string;
  title: string;
  duration: number;
  poster: string;
  director: string;
  price?: string | number;
  avgRating?: number;
  reviewCount?: number;
  trailerUrl?: string;
  genres?: Genre[];
}

export interface Genre {
  id: string;
  designation: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/v2/movies';

  selectedMovie = signal<Movie | null>(null);

  constructor(private http: HttpClient) {}

  getMovies(): Observable<{ data: Movie[] }> {
    return this.http.get<{ data: Movie[] }>(this.apiUrl);
  }

  getMovie(id: string): Observable<{ data: Movie }> {
    return this.http.get<{ data: Movie }>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: Partial<Movie>): Observable<{ data: Movie }> {
    return this.http.post<{ data: Movie }>(this.apiUrl, movie);
  }

  updateMovie(id: string, movie: Partial<Movie>): Observable<{ data: Movie }> {
    return this.http.patch<{ data: Movie }>(`${this.apiUrl}/${id}`, movie);
  }

  deleteMovie(id: string): Observable<{ data: unknown }> {
    return this.http.delete<{ data: unknown }>(`${this.apiUrl}/${id}`);
  }

  selectMovie(movie: Movie | null): void {
    this.selectedMovie.set(movie);
  }
}
