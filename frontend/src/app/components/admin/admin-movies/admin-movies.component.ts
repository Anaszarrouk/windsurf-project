import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService, Movie } from '../../../services/movie.service';
import { GenreService, Genre } from '../../../services/genre.service';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="page-title">Movies Management</h2>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top: 0;">{{ editingId() ? 'Edit Movie' : 'Add Movie' }}</h3>

        <form #f="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Title</label>
              <input name="title" [(ngModel)]="form.title" required />
            </div>

            <div class="form-group">
              <label>Director</label>
              <input name="director" [(ngModel)]="form.director" required />
            </div>

            <div class="form-group">
              <label>Duration (min)</label>
              <input name="duration" type="number" [(ngModel)]="form.duration" required min="1" />
            </div>

            <div class="form-group">
              <label>Poster URL</label>
              <input name="poster" [(ngModel)]="form.poster" />
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Genres</label>
              <select multiple name="genreIds" [(ngModel)]="form.genreIds">
                @for (g of genres(); track g.id) {
                  <option [ngValue]="g.id">{{ g.designation }}</option>
                }
              </select>
              <small style="color:#888">Hold Ctrl/Command to select multiple</small>
            </div>
          </div>

          @if (error()) {
            <div class="error" style="margin-top: 10px;">{{ error() }}</div>
          }

          <div class="actions">
            <button class="btn btn-primary" type="submit" [disabled]="f.invalid || isSaving()">
              {{ isSaving() ? 'Saving…' : (editingId() ? 'Update' : 'Create') }}
            </button>
            @if (editingId()) {
              <button class="btn btn-secondary" type="button" (click)="resetForm()">Cancel</button>
            }
          </div>
        </form>
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
          <h3 style="margin:0;">All Movies</h3>
          <div style="color:#888;">{{ moviesCount() }} total</div>
        </div>

        @if (isLoading()) {
          <p>Loading…</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Director</th>
                  <th>Duration</th>
                  <th>Genres</th>
                  <th style="width: 170px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (m of movies(); track m.id) {
                  <tr>
                    <td>
                      <div style="font-weight: 700;">{{ m.title }}</div>
                      @if (m.poster) {
                        <div style="color:#888; font-size: 12px; overflow:hidden; text-overflow:ellipsis; max-width: 360px; white-space: nowrap;">{{ m.poster }}</div>
                      }
                    </td>
                    <td>{{ m.director }}</td>
                    <td>{{ m.duration }} min</td>
                    <td>
                      <div class="chips">
                        @for (g of (m.genres ?? []); track g.id) {
                          <span class="chip">{{ g.designation }}</span>
                        }
                      </div>
                    </td>
                    <td>
                      <div class="row-actions">
                        <button class="btn btn-secondary" type="button" (click)="startEdit(m)">Edit</button>
                        <button class="btn btn-danger" type="button" (click)="remove(m)" [disabled]="isDeletingId() === m.id">Delete</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" style="color:#888;">No movies found.</td>
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
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-group {
      display: grid;
      gap: 6px;
    }
    input, select {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
    }
    select[multiple] {
      min-height: 120px;
    }
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    .table-wrap {
      overflow: auto;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th, .table td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      vertical-align: top;
    }
    .row-actions {
      display: flex;
      gap: 8px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #f2c6c8;
    }
    .error {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #ffd7da;
    }
    @media (max-width: 980px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminMoviesComponent {
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);

  isSaving = signal(false);
  isLoading = signal(true);
  isDeletingId = signal<string | null>(null);
  error = signal<string>('');

  editingId = signal<string | null>(null);

  form: { title: string; director: string; duration: number | null; poster: string; genreIds: string[] } = {
    title: '',
    director: '',
    duration: null,
    poster: '',
    genreIds: [],
  };

  genres = toSignal(this.genreService.getGenres().pipe(map((r) => r.data)), { initialValue: [] as Genre[] });

  movies = signal<Movie[]>([]);

  constructor() {
    // Load movies initially and whenever refreshTick changes.
    this.reload();
  }

  moviesCount = computed(() => this.movies().length);

  private reload(): void {
    this.isLoading.set(true);
    this.movieService.getMovies().pipe(map((r) => r.data)).subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load movies');
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = { title: '', director: '', duration: null, poster: '', genreIds: [] };
    this.error.set('');
  }

  startEdit(movie: Movie): void {
    this.editingId.set(movie.id);
    this.form = {
      title: movie.title,
      director: movie.director,
      duration: movie.duration,
      poster: movie.poster || '',
      genreIds: (movie.genres ?? []).map((g) => g.id),
    };
    this.error.set('');
  }

  onSubmit(): void {
    this.error.set('');
    this.isSaving.set(true);

    const payload = {
      title: this.form.title,
      director: this.form.director,
      duration: Number(this.form.duration ?? 0),
      poster: this.form.poster || undefined,
      genreIds: this.form.genreIds,
    };

    const req$ = this.editingId()
      ? this.movieService.updateMovie(this.editingId()!, payload)
      : this.movieService.createMovie(payload);

    req$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.resetForm();
        this.reload();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.error.set(err?.error?.message || 'Save failed');
      },
    });
  }

  remove(movie: Movie): void {
    if (!confirm(`Delete "${movie.title}"?`)) {
      return;
    }
    this.error.set('');
    this.isDeletingId.set(movie.id);
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => {
        this.isDeletingId.set(null);
        this.reload();
      },
      error: (err) => {
        this.isDeletingId.set(null);
        this.error.set(err?.error?.message || 'Delete failed');
      },
    });
  }
}
