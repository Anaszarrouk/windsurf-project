import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Genre {
  id: string;
  designation: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = 'http://localhost:3000/genres';

  constructor(private http: HttpClient) {}

  getGenres(): Observable<{ data: Genre[] }> {
    return this.http.get<{ data: Genre[] }>(this.apiUrl);
  }

  getGenre(id: string): Observable<{ data: Genre }> {
    return this.http.get<{ data: Genre }>(`${this.apiUrl}/${id}`);
  }

  createGenre(payload: Partial<Genre>): Observable<{ data: Genre }> {
    return this.http.post<{ data: Genre }>(this.apiUrl, payload);
  }

  updateGenre(id: string, payload: Partial<Genre>): Observable<{ data: Genre }> {
    return this.http.patch<{ data: Genre }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteGenre(id: string): Observable<{ data: unknown }> {
    return this.http.delete<{ data: unknown }>(`${this.apiUrl}/${id}`);
  }
}
