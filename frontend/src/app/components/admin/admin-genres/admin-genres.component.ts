import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { GenreService, Genre } from '../../../services/genre.service';

@Component({
  selector: 'app-admin-genres',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="page-title">Genres Management</h2>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top: 0;">{{ editingId() ? 'Edit Genre' : 'Add Genre' }}</h3>

        <form #f="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Designation</label>
            <input name="designation" [(ngModel)]="designation" required />
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
          <h3 style="margin:0;">All Genres</h3>
          <div style="color:#888;">{{ genresCount() }} total</div>
        </div>

        @if (isLoading()) {
          <p>Loading…</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Designation</th>
                  <th style="width: 140px;">Movies</th>
                  <th style="width: 170px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (g of genres(); track g.id) {
                  <tr>
                    <td style="font-weight: 700;">{{ g.designation }}</td>
                    <td style="color:#bbb;">{{ g.movies?.length || 0 }}</td>
                    <td>
                      <div class="row-actions">
                        <button class="btn btn-secondary" type="button" (click)="startEdit(g)">Edit</button>
                        <button class="btn btn-danger" type="button" (click)="remove(g)" [disabled]="isDeletingId() === g.id">Delete</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" style="color:#888;">No genres found.</td>
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
      grid-template-columns: 360px 1fr;
      gap: 16px;
      align-items: start;
    }
    .form-group {
      display: grid;
      gap: 6px;
    }
    input {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
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
export class AdminGenresComponent {
  private genreService = inject(GenreService);

  genres = signal<Array<Genre & { movies?: unknown[] }>>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeletingId = signal<string | null>(null);
  error = signal<string>('');

  editingId = signal<string | null>(null);
  designation = '';

  genresCount = computed(() => this.genres().length);

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.isLoading.set(true);
    this.genreService.getGenres().pipe(map((r) => r.data as Array<Genre & { movies?: unknown[] }>)).subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load genres');
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.designation = '';
    this.error.set('');
  }

  startEdit(genre: Genre): void {
    this.editingId.set(genre.id);
    this.designation = genre.designation;
    this.error.set('');
  }

  onSubmit(): void {
    this.error.set('');
    this.isSaving.set(true);

    const payload = { designation: this.designation };
    const req$ = this.editingId()
      ? this.genreService.updateGenre(this.editingId()!, payload)
      : this.genreService.createGenre(payload);

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

  remove(genre: Genre): void {
    if (!confirm(`Delete "${genre.designation}"?`)) {
      return;
    }
    this.error.set('');
    this.isDeletingId.set(genre.id);
    this.genreService.deleteGenre(genre.id).subscribe({
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
