import { Component, Input } from '@angular/core';
import { Movie } from '../../../services/movie.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [DefaultImagePipe],
  template: `
    <div class="movie-item card">
      <img [src]="movie.poster | defaultImage" [alt]="movie.title">
      <div class="movie-info">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.director }} | {{ movie.duration }} min</p>
      </div>
    </div>
  `,
  styles: [`
    .movie-item {
      display: flex;
      gap: 15px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .movie-item:hover {
      transform: translateX(5px);
    }
    .movie-item img {
      width: 80px;
      height: 120px;
      object-fit: cover;
      border-radius: 4px;
    }
    .movie-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .movie-info h3 {
      margin-bottom: 5px;
      font-size: 16px;
    }
    .movie-info p {
      color: #999;
      font-size: 14px;
    }
  `]
})
export class ItemComponent {
  @Input({ required: true }) movie!: Movie;
}
