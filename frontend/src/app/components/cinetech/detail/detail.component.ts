import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Movie } from '../../../services/movie.service';
import { BookingCartService } from '../../../services/booking-cart.service';
import { ReviewService, Review } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { ScreeningService, Screening } from '../../../services/screening.service';
import { NotificationService } from '../../../services/notification.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DefaultImagePipe, SafeUrlPipe],
  template: `
    <div class="movie-detail card">
      <img [src]="movie.poster | defaultImage" [alt]="movie.title">
      <div class="detail-content">
        <h2>{{ movie.title }}</h2>
        <p class="director"><strong>Director:</strong> {{ movie.director }}</p>
        <p class="duration"><strong>Duration:</strong> {{ movie.duration }} minutes</p>
        @if (reviewCount() > 0) {
          <p class="rating"><strong>Rating:</strong> {{ avgRating() | number: '1.1-1' }}/5 ({{ reviewCount() }} reviews)</p>
        }
        @if (price() != null) {
          <p class="price"><strong>Price:</strong> {{ price()! | number: '1.2-2' }}</p>
        }
        @if (movie.genres && movie.genres.length > 0) {
          <div class="genres">
            <strong>Genres:</strong>
            @for (genre of movie.genres; track genre.id) {
              <span class="genre-tag">{{ genre.designation }}</span>
            }
          </div>
        }
        @if (youtubeEmbedUrl()) {
          <div class="trailer">
            <strong>Trailer:</strong>
            <div class="trailer-frame">
              <iframe
                width="100%"
                height="315"
                [src]="youtubeEmbedUrl()! | safeUrl"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            </div>
          </div>
        }
        <div class="actions">
          @if (isInCart()) {
            <button class="btn btn-secondary" (click)="removeFromCart()">Remove from Cart</button>
          } @else {
            <button class="btn btn-primary" (click)="addToCart()">Add to Cart</button>
          }
        </div>

        <div class="showtimes" style="margin-top: 18px;">
          <h3>Showtimes</h3>

          @if (screeningsError) {
            <div class="error">{{ screeningsError }}</div>
          }

          @if (isLoadingScreenings) {
            <div class="card"><p>Loading showtimes...</p></div>
          } @else {
            @if (screenings.length > 0) {
              <div class="showtimes-grid">
                @for (s of screenings; track s.id) {
                  <div class="card showtime-item">
                    <div class="showtime-time">
                      <strong>{{ s.startsAt | date: 'EEE, MMM d, shortTime' }}</strong>
                      <div class="muted">Ends: {{ s.endsAt | date: 'shortTime' }}</div>
                    </div>
                    <div class="showtime-meta">
                      <div><strong>Room:</strong> {{ s.room }}</div>
                      <div class="muted">Seats: {{ s.ticketsSold }}/{{ s.capacity }}</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="card"><p>No scheduled screenings for this movie.</p></div>
            }
          }
        </div>

        <div class="reviews">
          <h3>Reviews</h3>

          @if (isAuthenticated()) {
            <div class="card review-form">
              <div class="form-group">
                <label>Rating</label>
                <div class="stars" role="radiogroup" aria-label="Rating">
                  @for (s of stars; track s) {
                    <button
                      type="button"
                      class="star"
                      [class.filled]="(myRating ?? 0) >= s"
                      (click)="setMyRating(s)"
                      [attr.aria-label]="'Set rating to ' + s">
                      ★
                    </button>
                  }
                </div>
              </div>

              <div class="form-group">
                <label>Comment (optional)</label>
                <textarea rows="3" [(ngModel)]="myComment"></textarea>
              </div>

              <div class="actions" style="margin-top: 10px;">
                <button class="btn btn-primary" [disabled]="isSubmitting || myRating == null" (click)="submitReview()">
                  Submit review
                </button>
              </div>
            </div>
          } @else {
            <div class="card">
              <p>Please log in to submit a review.</p>
            </div>
          }

          @if (isLoadingReviews) {
            <div class="card">
              <p>Loading reviews...</p>
            </div>
          } @else {
            <div class="reviews-list">
              @for (r of reviews; track r.id) {
                <div class="card review-item">
                  <div class="review-meta">
                    <strong>{{ r.user?.username || 'User' }}</strong>
                    <span class="review-date">{{ r.createdAt | date: 'short' }}</span>
                  </div>
                  <div class="review-rating">
                    @for (s of stars; track s) {
                      <span class="star readonly" [class.filled]="r.rating >= s">★</span>
                    }
                  </div>
                  @if (r.comment) {
                    <div class="review-comment">{{ r.comment }}</div>
                  }
                </div>
              } @empty {
                <div class="card">
                  <p>No reviews yet.</p>
                </div>
              }
            </div>
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
    .rating {
      color: #fff;
      font-weight: 600;
    }
    .price {
      color: #fff;
      font-weight: 600;
    }
    .trailer {
      margin-top: 15px;
    }
    .trailer-frame {
      margin-top: 10px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #2a2a2a;
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
    .reviews {
      margin-top: 25px;
    }
    .reviews h3 {
      margin: 10px 0 12px;
      color: #e50914;
    }
    .showtimes h3 {
      margin: 10px 0 12px;
      color: #e50914;
    }
    .showtimes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .showtime-item {
      display: grid;
      gap: 8px;
    }
    .muted {
      color: #888;
      font-size: 12px;
    }
    @media (max-width: 900px) {
      .showtimes-grid {
        grid-template-columns: 1fr;
      }
    }
    .review-form textarea {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #333;
      background: #1a1a1a;
      color: #fff;
      resize: vertical;
    }
    .stars {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }
    .star {
      background: transparent;
      border: none;
      color: #666;
      font-size: 22px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .star.readonly {
      cursor: default;
    }
    .star.filled {
      color: #f5c542;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .review-meta {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      color: #ddd;
      margin-bottom: 6px;
    }
    .review-date {
      color: #888;
      font-size: 12px;
    }
    .review-rating {
      color: #cfcfcf;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .review-comment {
      color: #ccc;
      white-space: pre-wrap;
    }
    .error {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #ffd7da;
      margin-bottom: 12px;
    }
  `]
})
export class DetailComponent implements OnChanges {
  @Input({ required: true }) movie!: Movie;
  
  private bookingService = inject(BookingCartService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private screeningService = inject(ScreeningService);
  private notificationService = inject(NotificationService);

  reviews: Review[] = [];
  isLoadingReviews = false;
  isSubmitting = false;
  reviewsError = '';

  screenings: Screening[] = [];
  isLoadingScreenings = false;
  screeningsError = '';

  myRating: number | null = null;
  myComment = '';

  stars = [1, 2, 3, 4, 5];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie'] && this.movie?.id) {
      this.loadReviews();
      this.loadScreenings();
    }
  }

  private loadScreenings(): void {
    this.screeningsError = '';
    this.isLoadingScreenings = true;
    this.screeningService.getScreenings(this.movie.id).pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => {
        this.screenings = screenings;
        this.isLoadingScreenings = false;
      },
      error: (err) => {
        this.screeningsError = err?.error?.message || 'Failed to load showtimes';
        this.isLoadingScreenings = false;
      },
    });
  }

  setMyRating(value: number): void {
    this.myRating = value;
  }

  price(): number | null {
    const raw: unknown = (this.movie as any)?.price;
    if (raw == null || raw === '') return null;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  reviewCount(): number {
    const raw: unknown = (this.movie as any)?.reviewCount;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  avgRating(): number {
    const raw: unknown = (this.movie as any)?.avgRating;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  private loadReviews(): void {
    this.reviewsError = '';
    this.isLoadingReviews = true;
    this.reviewService.getReviews(this.movie.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoadingReviews = false;
      },
      error: (err) => {
        this.reviewsError = err?.error?.message || 'Failed to load reviews';
        this.isLoadingReviews = false;
      },
    });
  }

  submitReview(): void {
    if (this.myRating == null) return;

    this.isSubmitting = true;
    this.reviewsError = '';

    this.reviewService.createReview(this.movie.id, {
      rating: this.myRating,
      comment: (this.myComment || '').trim() || undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.myRating = null;
        this.myComment = '';
        this.notificationService.success('Review submitted');
        this.loadReviews();
      },
      error: (err) => {
        this.isSubmitting = false;
        const status: number | undefined = err?.status;
        const message =
          status === 409 ? 'You already reviewed this movie. You can’t submit another review.' :
          status === 401 || status === 403 ? 'Please log in to submit a review.' :
          status === 400 ? 'Please choose a rating and try again.' :
          'Something went wrong while submitting your review. Please try again.';

        this.notificationService.error(message);
      },
    });
  }

  youtubeEmbedUrl(): string | null {
    const url = this.movie?.trailerUrl;
    if (!url) return null;

    const id = this.extractYouTubeId(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  }

  private extractYouTubeId(url: string): string | null {
    const trimmed = url.trim();
    if (!trimmed) return null;

    try {
      const u = new URL(trimmed);

      if (u.hostname === 'youtu.be') {
        return u.pathname.replace('/', '') || null;
      }

      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return v;

        const match = u.pathname.match(/\/embed\/([^/?]+)/);
        if (match?.[1]) return match[1];
      }
    } catch {
      // ignore
    }

    const fallback = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return fallback?.[1] ?? null;
  }

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
