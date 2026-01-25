import { Component, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService, Movie } from '../../../services/movie.service';
import { ListeComponent } from '../liste/liste.component';
import { DetailComponent } from '../detail/detail.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [ListeComponent, DetailComponent],
  template: `
    <div class="movie-container">
      <h1 class="page-title">Movies</h1>
      <div class="movie-layout">
        <div class="movie-list-section">
          <app-liste 
            [movies]="movies()" 
            (movieSelected)="onMovieSelected($event)">
          </app-liste>
        </div>
        <div class="movie-detail-section">
          @if (selectedMovie()) {
            <app-detail [movie]="selectedMovie()!"></app-detail>
          } @else {
            <div class="no-selection card">
              <p>Select a movie to view details</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .no-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      color: #999;
    }
    @media (max-width: 768px) {
      .movie-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieComponent {
  private movieService = inject(MovieService);

  movies = toSignal(
    this.movieService.getMovies().pipe(map(res => res.data)),
    { initialValue: [] }
  );

  selectedMovie = this.movieService.selectedMovie;

  onMovieSelected(movie: Movie): void {
    this.movieService.selectMovie(movie);
  }
}
