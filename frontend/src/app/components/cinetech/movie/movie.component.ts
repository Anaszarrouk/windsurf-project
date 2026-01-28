import { Component, signal, inject, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService, Movie } from '../../../services/movie.service';
import { GenreService, Genre } from '../../../services/genre.service';
import { ListeComponent } from '../liste/liste.component';
import { DetailComponent } from '../detail/detail.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [FormsModule, ListeComponent, DetailComponent],
  template: `
    <div class="movie-container">
      <h1 class="page-title">Movies</h1>
      <div class="card" style="margin-bottom: 20px;">
        <div class="filters">
          <div class="form-group">
            <label>Search</label>
            <input
              type="text"
              [ngModel]="search()"
              (ngModelChange)="search.set($event)"
              placeholder="Title or director" />
          </div>

          <div class="form-group">
            <label>Genre</label>
            <select [ngModel]="selectedGenreId()" (ngModelChange)="selectedGenreId.set($event)">
              <option [ngValue]="''">All</option>
              @for (g of genres(); track g.id) {
                <option [ngValue]="g.id">{{ g.designation }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label>Min price</label>
            <input
              type="number"
              [ngModel]="minPrice()"
              (ngModelChange)="onMinPriceChange($event)"
              min="0"
              step="0.01" />
          </div>

          <div class="form-group">
            <label>Max price</label>
            <input
              type="number"
              [ngModel]="maxPrice()"
              (ngModelChange)="onMaxPriceChange($event)"
              min="0"
              step="0.01" />
          </div>
        </div>
      </div>
      <div class="movie-layout">
        <div class="movie-list-section">
          <app-liste 
            [movies]="pagedMovies()" 
            (movieSelected)="onMovieSelected($event)">
          </app-liste>

          @if (totalPages() > 1) {
            <div class="card pagination">
              <button type="button" class="btn btn-secondary" [disabled]="currentPage() <= 1" (click)="prevPage()">Prev</button>
              <div class="page-info">Page {{ currentPage() }} / {{ totalPages() }}</div>
              <button type="button" class="btn btn-secondary" [disabled]="currentPage() >= totalPages()" (click)="nextPage()">Next</button>
            </div>
          }
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
    .filters {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 12px;
      align-items: end;
    }
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
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 15px;
      padding: 12px;
    }
    .page-info {
      color: #ccc;
      font-weight: 600;
    }
    @media (max-width: 768px) {
      .filters {
        grid-template-columns: 1fr;
      }
      .movie-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieComponent {
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);

  search = signal('');
  selectedGenreId = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  private readonly pageSize = 6;
  currentPage = signal(1);

  movies = toSignal(
    this.movieService.getMovies().pipe(map(res => res.data)),
    { initialValue: [] }
  );

  genres = toSignal(
    this.genreService.getGenres().pipe(map((r) => r.data)),
    { initialValue: [] as Genre[] }
  );

  filteredMovies = computed(() => {
    const q = (this.search() || '').trim().toLowerCase();
    const selectedGenreId = (this.selectedGenreId() || '').trim();
    const minPrice = this.minPrice();
    const maxPrice = this.maxPrice();
    let min = minPrice == null || Number.isNaN(minPrice) ? null : Number(minPrice);
    let max = maxPrice == null || Number.isNaN(maxPrice) ? null : Number(maxPrice);

    // Normalize the range so typing doesn't temporarily "break" the filter.
    if (min != null && max != null && min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return (this.movies() ?? []).filter((m) => {
      const title = (m.title || '').toLowerCase();
      const director = (m.director || '').toLowerCase();
      const matchesText = !q || title.includes(q) || director.includes(q);

      const matchesGenre = !selectedGenreId || (m.genres ?? []).some((g) => g.id === selectedGenreId);

      const price = this.parseMoviePrice(m);
      const hasPriceFilter = min != null || max != null;

      // If user is filtering by price, ignore movies that have no price.
      if (hasPriceFilter && price == null) {
        return false;
      }

      const matchesMin = min == null || (price != null && price >= min);
      const matchesMax = max == null || (price != null && price <= max);

      return matchesText && matchesGenre && matchesMin && matchesMax;
    });
  });

  totalPages = computed(() => {
    const total = this.filteredMovies().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  pagedMovies = computed(() => {
    const page = this.currentPage();
    const totalPages = this.totalPages();
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * this.pageSize;
    return this.filteredMovies().slice(start, start + this.pageSize);
  });

  selectedMovie = this.movieService.selectedMovie;

  constructor() {
    // Reset to page 1 when filters change.
    effect(() => {
      this.search();
      this.selectedGenreId();
      this.minPrice();
      this.maxPrice();
      this.currentPage.set(1);
    });

    // Clamp page if user is on a page that no longer exists after filtering.
    effect(() => {
      const total = this.totalPages();
      const page = this.currentPage();
      if (page > total) {
        this.currentPage.set(total);
      }
    });
  }

  nextPage(): void {
    this.currentPage.set(Math.min(this.totalPages(), this.currentPage() + 1));
  }

  prevPage(): void {
    this.currentPage.set(Math.max(1, this.currentPage() - 1));
  }

  onMinPriceChange(value: unknown): void {
    this.minPrice.set(this.parseNullableNumber(value));
  }

  onMaxPriceChange(value: unknown): void {
    this.maxPrice.set(this.parseNullableNumber(value));
  }

  private parseNullableNumber(value: unknown): number | null {
    if (value == null || value === '') return null;
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private parseMoviePrice(movie: Movie): number | null {
    const raw: unknown = (movie as any)?.price;
    if (raw == null || raw === '') return null;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  onMovieSelected(movie: Movie): void {
    this.movieService.selectMovie(movie);
  }
}
