import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';
import { AuthService } from '../../services/auth.service';
import { Movie, MovieService } from '../../services/movie.service';
import { Screening, ScreeningService } from '../../services/screening.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe],
  template: `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1>CineVault</h1>
          <p>
            Discover movies, check showtimes, and manage your cart in one place.
          </p>
          <div class="hero-actions">
            <a routerLink="/movies" class="btn btn-primary">Browse Movies</a>
            @if (isAuthenticated()) {
              <a routerLink="/cart" class="btn btn-secondary">View Cart</a>
            } @else {
              <a routerLink="/login" class="btn btn-secondary">Login</a>
              <a routerLink="/register" class="btn btn-secondary">Register</a>
            }
          </div>
        </div>
        <div class="hero-art">
          <div class="hero-stat card">
            <div class="label">Quick tip</div>
            <div class="value">Top rated picks</div>
            <div class="hint">Open any movie to see reviews and rating.</div>
          </div>
          <div class="hero-stat card">
            <div class="label">Need help?</div>
            <div class="value">Report an issue</div>
            <div class="hint">Use the Report link in the header anytime.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="showtimes">
      <div class="section-head">
        <h2>Today’s Showtimes</h2>
        <a routerLink="/movies" class="btn btn-secondary">Browse</a>
      </div>

      @if (isLoadingScreenings()) {
        <div class="card" style="margin-top: 12px;"><p>Loading showtimes...</p></div>
      } @else {
        @if (screeningsError()) {
          <div class="card" style="margin-top: 12px;"><p class="muted">{{ screeningsError() }}</p></div>
        }

        <div class="showtimes-grid">
          @for (s of todayScreenings(); track s.id) {
            <a class="showtime-card card" [routerLink]="['/movies', s.movieId]">
              <img [src]="(s.movie?.poster || '') | defaultImage" [alt]="s.movie?.title || 'Movie'" />
              <div class="showtime-meta">
                <div class="title">{{ s.movie?.title || 'Movie' }}</div>
                <div class="sub">
                  {{ s.startsAt | date: 'EEE, MMM d, shortTime' }}
                  <span class="dot">·</span>
                  Room {{ s.room }}
                </div>
                <div class="sub">Seats: {{ s.ticketsSold }}/{{ s.capacity }}</div>
              </div>
            </a>
          } @empty {
            <div class="card"><p class="muted">No showtimes scheduled for today.</p></div>
          }
        </div>
      }
    </section>

    <section class="top-movies">
      <div class="section-head">
        <h2>Top Movies</h2>
        <a routerLink="/movies" class="btn btn-secondary">See all</a>
      </div>

      @if (isLoading()) {
        <div class="card" style="margin-top: 12px;"><p>Loading movies...</p></div>
      } @else {
        @if (error()) {
          <div class="card" style="margin-top: 12px;"><p class="muted">{{ error() }}</p></div>
        }

        <div class="top-grid">
          @for (m of topMovies(); track m.id) {
            <a class="top-card card" [routerLink]="['/movies', m.id]">
              <img [src]="m.poster | defaultImage" [alt]="m.title" />
              <div class="top-meta">
                <div class="title">{{ m.title }}</div>
                <div class="sub">{{ m.director }} · {{ m.duration }} min</div>
                @if ((m.reviewCount ?? 0) > 0) {
                  <div class="sub">{{ m.avgRating | number: '1.1-1' }}/5 ({{ m.reviewCount }} reviews)</div>
                }
              </div>
            </a>
          } @empty {
            <div class="card"><p class="muted">No movies found.</p></div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .hero {
      padding: 44px 20px;
      background: radial-gradient(1200px 500px at 10% 10%, rgba(229,9,20,0.25), transparent 60%),
        linear-gradient(135deg, #141414 0%, #242424 100%);
      border-radius: 12px;
      margin-bottom: 26px;
    }
    .hero-inner {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 18px;
      align-items: stretch;
    }
    .hero-copy h1 {
      font-size: 46px;
      margin: 0 0 10px;
      color: #e50914;
      letter-spacing: -0.6px;
    }
    .hero-copy p {
      font-size: 16px;
      color: #bbb;
      margin: 0 0 18px;
      max-width: 60ch;
      line-height: 1.5;
    }
    .hero-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .hero-art {
      display: grid;
      gap: 12px;
    }
    .hero-stat {
      padding: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.25);
    }
    .hero-stat .label {
      color: #888;
      font-size: 12px;
    }
    .hero-stat .value {
      margin-top: 6px;
      font-weight: 800;
      font-size: 18px;
      color: #fff;
    }
    .hero-stat .hint {
      margin-top: 6px;
      color: #aaa;
      font-size: 12px;
    }

    .top-movies {
      margin-top: 26px;
    }

    .showtimes {
      margin-top: 26px;
    }
    .showtimes-grid {
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .showtime-card {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 12px;
      padding: 12px;
      text-decoration: none;
      color: inherit;
      border: 1px solid rgba(255,255,255,0.08);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .showtime-card:hover {
      transform: translateY(-2px);
      border-color: rgba(229,9,20,0.35);
    }
    .showtime-card img {
      width: 80px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
    }
    .showtime-meta .title {
      font-weight: 800;
      color: #fff;
    }
    .showtime-meta .sub {
      margin-top: 6px;
      color: #aaa;
      font-size: 12px;
    }
    .dot {
      margin: 0 6px;
      color: rgba(255,255,255,0.35);
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .section-head h2 {
      margin: 0;
      color: #e50914;
      letter-spacing: -0.2px;
    }
    .top-grid {
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .top-card {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 12px;
      padding: 12px;
      text-decoration: none;
      color: inherit;
      border: 1px solid rgba(255,255,255,0.08);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .top-card:hover {
      transform: translateY(-2px);
      border-color: rgba(229,9,20,0.35);
    }
    .top-card img {
      width: 80px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
    }
    .top-meta .title {
      font-weight: 800;
      color: #fff;
    }
    .top-meta .sub {
      margin-top: 6px;
      color: #aaa;
      font-size: 12px;
    }
    .muted {
      color: #888;
    }

    @media (max-width: 768px) {
      .hero-inner {
        grid-template-columns: 1fr;
      }
      .showtimes-grid {
        grid-template-columns: 1fr;
      }
      .top-grid {
        grid-template-columns: 1fr;
      }
      .hero-copy h1 { font-size: 30px; }
    }
  `]
})
export class HomeComponent {
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private screeningService = inject(ScreeningService);

  isAuthenticated = this.authService.isAuthenticated;

  isLoading = signal(true);
  error = signal('');
  movies = signal<Movie[]>([]);

  topMovies = signal<Movie[]>([]);

  isLoadingScreenings = signal(true);
  screeningsError = signal('');
  todayScreenings = signal<Screening[]>([]);

  constructor() {
    this.load();
    this.loadTodayScreenings();
  }

  private load(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.movieService.getMovies().pipe(map((r) => r.data as Movie[])).subscribe({
      next: (list) => {
        const movies = list || [];
        this.movies.set(movies);

        const sorted = [...movies].sort((a, b) => {
          const ar = Number((a as any)?.avgRating) || 0;
          const br = Number((b as any)?.avgRating) || 0;
          if (br !== ar) return br - ar;

          const ac = Number((a as any)?.reviewCount) || 0;
          const bc = Number((b as any)?.reviewCount) || 0;
          if (bc !== ac) return bc - ac;

          return String(a.title || '').localeCompare(String(b.title || ''));
        });

        this.topMovies.set(sorted.slice(0, 6));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Could not load movies right now.');
      },
    });
  }

  private loadTodayScreenings(): void {
    this.isLoadingScreenings.set(true);
    this.screeningsError.set('');

    this.screeningService.getToday().pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => {
        const list = screenings || [];
        const sorted = [...list].sort((a, b) => {
          const at = new Date(a.startsAt).getTime();
          const bt = new Date(b.startsAt).getTime();
          return at - bt;
        });
        this.todayScreenings.set(sorted.slice(0, 6));
        this.isLoadingScreenings.set(false);
      },
      error: () => {
        this.isLoadingScreenings.set(false);
        this.screeningsError.set('Could not load showtimes right now.');
      },
    });
  }
}
