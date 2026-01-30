import { Component, input, output } from '@angular/core';
import { Movie } from '../../../services/movie.service';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [ItemComponent],
  template: `
    <div class="movie-list">
      @for (movie of movies(); track movie.id) {
        <app-item 
          [movie]="movie" 
          (click)="selectMovie(movie)">
        </app-item>
      } @empty {
        <div class="no-movies card">
          <p>No movies available</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .movie-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .no-movies {
      text-align: center;
      color: #999;
      padding: 40px;
    }
  `]
})
export class ListeComponent {
  movies = input<Movie[]>([]);
  movieSelected = output<Movie>();

  selectMovie(movie: Movie): void {
    this.movieSelected.emit(movie);
  }
}
