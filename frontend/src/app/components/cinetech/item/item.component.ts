import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../services/movie.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, DefaultImagePipe],
  template: `
    <div class="movie-item card">
      <img [src]="movie().poster | defaultImage" [alt]="movie().title">
      <div class="movie-info">
        <h3>{{ movie().title }}</h3>
        <p>{{ movie().director }} | {{ movie().duration }} min</p>
        @if (reviewCount() > 0) {
          <p class="rating">{{ avgRating() | number: '1.1-1' }}/5 ({{ reviewCount() }} reviews)</p>
        }
        @if (price() != null) {
          <p class="price">{{ price()! | number: '1.2-2' }}</p>
        }
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
    .rating {
      color: #cfcfcf;
      font-size: 13px;
      margin-top: 6px;
    }
    .price {
      color: #fff;
      font-weight: 600;
      margin-top: 6px;
    }
  `]
})
export class ItemComponent {
  movie = input.required<Movie>();

  price = computed(() => {
    const raw: unknown = (this.movie() as any)?.price;
    if (raw == null || raw === '') return null;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  });

  reviewCount = computed(() => {
    const raw: unknown = (this.movie() as any)?.reviewCount;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  });

  avgRating = computed(() => {
    const raw: unknown = (this.movie() as any)?.avgRating;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  });
}
