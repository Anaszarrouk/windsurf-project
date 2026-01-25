import { Component, Input, inject } from '@angular/core';
import { Movie } from '../../../services/movie.service';
import { BookingCartService } from '../../../services/booking-cart.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [DefaultImagePipe],
  template: `
    <div class="movie-detail card">
      <img [src]="movie.poster | defaultImage" [alt]="movie.title">
      <div class="detail-content">
        <h2>{{ movie.title }}</h2>
        <p class="director"><strong>Director:</strong> {{ movie.director }}</p>
        <p class="duration"><strong>Duration:</strong> {{ movie.duration }} minutes</p>
        @if (movie.genres && movie.genres.length > 0) {
          <div class="genres">
            <strong>Genres:</strong>
            @for (genre of movie.genres; track genre.id) {
              <span class="genre-tag">{{ genre.designation }}</span>
            }
          </div>
        }
        <div class="actions">
          @if (isInCart()) {
            <button class="btn btn-secondary" (click)="removeFromCart()">Remove from Cart</button>
          } @else {
            <button class="btn btn-primary" (click)="addToCart()">Add to Cart</button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail img {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .detail-content h2 {
      color: #e50914;
      margin-bottom: 15px;
    }
    .detail-content p {
      margin-bottom: 10px;
      color: #ccc;
    }
    .genres {
      margin: 15px 0;
    }
    .genre-tag {
      display: inline-block;
      background: #333;
      padding: 5px 10px;
      border-radius: 15px;
      margin: 5px 5px 5px 0;
      font-size: 12px;
    }
    .actions {
      margin-top: 20px;
    }
  `]
})
export class DetailComponent {
  @Input({ required: true }) movie!: Movie;
  
  private bookingService = inject(BookingCartService);

  isInCart(): boolean {
    return this.bookingService.isInCart(this.movie.id);
  }

  addToCart(): void {
    this.bookingService.addToCart(this.movie);
  }

  removeFromCart(): void {
    this.bookingService.removeFromCart(this.movie.id);
  }
}
