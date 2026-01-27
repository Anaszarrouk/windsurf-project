import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Movie, MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="page-title">Pricing & Discounts</h2>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top:0;">Price Overview</h3>
        <div class="stats">
          <div><strong>Movies:</strong> {{ count() }}</div>
          <div><strong>With price:</strong> {{ pricedCount() }}</div>
          <div><strong>Avg price:</strong> {{ avgPrice() != null ? (avgPrice()! | number:'1.2-2') : '—' }}</div>
          <div><strong>Min/Max:</strong> {{ minPrice() != null ? (minPrice()! | number:'1.2-2') : '—' }} / {{ maxPrice() != null ? (maxPrice()! | number:'1.2-2') : '—' }}</div>
        </div>

        <div class="form-row" style="margin-top: 12px;">
          <input type="number" min="0" step="0.01" [(ngModel)]="bulkPrice" placeholder="Set default price for all movies" />
          <button class="btn btn-secondary" type="button" (click)="applyBulkPrice()" [disabled]="bulkSaving()">Apply</button>
        </div>
        <div style="color:#888; font-size:12px; margin-top: 8px;">This updates each movie via /v2/movies PATCH.</div>

        @if (error()) {
          <div class="error" style="margin-top: 10px;">{{ error() }}</div>
        }
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
          <h3 style="margin:0;">Movie Prices</h3>
          <button class="btn btn-secondary" type="button" (click)="reload()">Refresh</button>
        </div>

        @if (isLoading()) {
          <p style="margin-top: 10px;">Loading…</p>
        } @else {
          <div class="table-wrap" style="margin-top: 10px;">
            <table class="table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th style="width: 180px;">Price</th>
                  <th style="width: 140px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (m of movies(); track m.id) {
                  <tr>
                    <td style="font-weight:700;">{{ m.title }}</td>
                    <td>
                      <input type="number" min="0" step="0.01" [(ngModel)]="draftPrices[m.id]" />
                    </td>
                    <td>
                      <button class="btn btn-primary" type="button" (click)="savePrice(m)" [disabled]="savingId() === m.id">
                        {{ savingId() === m.id ? 'Saving…' : 'Save' }}
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" style="color:#888;">No movies found.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 16px;
      align-items: start;
    }
    .stats {
      display: grid;
      gap: 8px;
      color: #bbb;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: center;
    }
    input {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
    }
    .table-wrap { overflow: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
    .error {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #ffd7da;
    }
    @media (max-width: 980px) {
      .grid { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminPricingComponent {
  private movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  isLoading = signal(true);
  error = signal<string>('');
  savingId = signal<string | null>(null);
  bulkSaving = signal(false);

  bulkPrice: number | null = null;
  draftPrices: Record<string, number | null> = {};

  count = computed(() => this.movies().length);

  pricedCount = computed(() => {
    return this.movies().filter((m) => this.parsePrice((m as any)?.price) > 0).length;
  });

  avgPrice = computed(() => {
    const prices = this.movies().map((m) => this.parsePrice((m as any)?.price)).filter((p) => p > 0);
    if (prices.length === 0) return null;
    return prices.reduce((a, b) => a + b, 0) / prices.length;
  });

  minPrice = computed(() => {
    const prices = this.movies().map((m) => this.parsePrice((m as any)?.price)).filter((p) => p > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  });

  maxPrice = computed(() => {
    const prices = this.movies().map((m) => this.parsePrice((m as any)?.price)).filter((p) => p > 0);
    if (prices.length === 0) return null;
    return Math.max(...prices);
  });

  constructor() {
    this.reload();
  }

  private parsePrice(raw: any): number {
    if (raw == null || raw === '') return 0;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : 0;
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.movieService.getMovies().pipe(map((r: any) => r.data as Movie[])).subscribe({
      next: (movies) => {
        this.movies.set(movies || []);
        this.draftPrices = {};
        for (const m of movies || []) {
          this.draftPrices[m.id] = this.parsePrice((m as any)?.price) || null;
        }
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load movies');
      },
    });
  }

  savePrice(movie: Movie): void {
    this.error.set('');
    this.savingId.set(movie.id);

    const price = this.draftPrices[movie.id];
    this.movieService.updateMovie(movie.id, { price: price ?? undefined }).subscribe({
      next: () => {
        this.savingId.set(null);
        this.reload();
      },
      error: (err: any) => {
        this.savingId.set(null);
        this.error.set(err?.error?.message || 'Failed to update price');
      },
    });
  }

  applyBulkPrice(): void {
    if (this.bulkPrice == null) return;
    if (!confirm('Apply this price to ALL movies?')) return;

    this.error.set('');
    this.bulkSaving.set(true);

    const list = this.movies();
    if (!list.length) {
      this.bulkSaving.set(false);
      return;
    }

    let remaining = list.length;
    for (const m of list) {
      this.movieService.updateMovie(m.id, { price: this.bulkPrice }).subscribe({
        next: () => {
          remaining -= 1;
          if (remaining === 0) {
            this.bulkSaving.set(false);
            this.reload();
          }
        },
        error: (err: any) => {
          remaining -= 1;
          this.error.set(err?.error?.message || 'Bulk update failed');
          if (remaining === 0) {
            this.bulkSaving.set(false);
            this.reload();
          }
        },
      });
    }
  }
}
