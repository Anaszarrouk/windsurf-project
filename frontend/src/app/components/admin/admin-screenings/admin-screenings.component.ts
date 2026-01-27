import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Screening, ScreeningService, ScreeningStatus } from '../../../services/screening.service';
import { MovieService, Movie } from '../../../services/movie.service';

@Component({
  selector: 'app-admin-screenings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="page-title">Screenings Management</h2>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top:0;">{{ editingId() ? 'Edit Screening' : 'Add Screening' }}</h3>

        <form #f="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Movie</label>
            <select name="movieId" [(ngModel)]="form.movieId" required>
              <option [ngValue]="''" disabled>Select a movie</option>
              @for (m of movies(); track m.id) {
                <option [ngValue]="m.id">{{ m.title }}</option>
              }
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Room</label>
              <input name="room" [(ngModel)]="form.room" />
            </div>

            <div class="form-group">
              <label>Status</label>
              <select name="status" [(ngModel)]="form.status">
                @for (s of statuses; track s) {
                  <option [ngValue]="s">{{ s }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Starts At</label>
              <input name="startsAt" type="datetime-local" [(ngModel)]="form.startsAt" required />
            </div>

            <div class="form-group">
              <label>Ends At</label>
              <input name="endsAt" type="datetime-local" [(ngModel)]="form.endsAt" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Capacity</label>
              <input name="capacity" type="number" min="1" [(ngModel)]="form.capacity" />
            </div>

            <div class="form-group">
              <label>Tickets Sold</label>
              <input name="ticketsSold" type="number" min="0" [(ngModel)]="form.ticketsSold" />
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
          <h3 style="margin:0;">All Screenings</h3>
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
                  <th>Time</th>
                  <th>Room</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                  <th style="width: 170px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (s of screenings(); track s.id) {
                  <tr>
                    <td style="font-weight:700;">{{ s.movie?.title || s.movieId }}</td>
                    <td>
                      <div style="font-weight:700;">{{ s.startsAt | date:'short' }}</div>
                      <div style="color:#888; font-size: 12px;">→ {{ s.endsAt | date:'shortTime' }}</div>
                    </td>
                    <td>{{ s.room }}</td>
                    <td style="color:#bbb;">{{ s.ticketsSold }}/{{ s.capacity }}</td>
                    <td>{{ s.status }}</td>
                    <td>
                      <div class="row-actions">
                        <button class="btn btn-secondary" type="button" (click)="startEdit(s)">Edit</button>
                        <button class="btn btn-danger" type="button" (click)="remove(s)" [disabled]="isDeletingId() === s.id">Delete</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" style="color:#888;">No screenings found.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div style="margin-top: 10px; color:#888;">{{ count() }} screenings</div>
        }

        @if (error()) {
          <div class="error" style="margin-top: 10px;">{{ error() }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: 440px 1fr;
      gap: 16px;
      align-items: start;
    }
    .form-group {
      display: grid;
      gap: 6px;
      margin-bottom: 10px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    input, select {
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
      margin-top: 10px;
    }
    .table-wrap { overflow: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
    .row-actions { display:flex; gap: 8px; }
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
export class AdminScreeningsComponent {
  private screeningService = inject(ScreeningService);
  private movieService = inject(MovieService);

  screenings = signal<Screening[]>([]);
  movies = signal<Movie[]>([]);

  isLoading = signal(true);
  isSaving = signal(false);
  isDeletingId = signal<string | null>(null);
  error = signal<string>('');

  editingId = signal<string | null>(null);

  statuses: ScreeningStatus[] = ['scheduled', 'in_progress', 'completed', 'cancelled'];

  form: {
    movieId: string;
    startsAt: string;
    endsAt: string;
    room: string;
    capacity: number;
    ticketsSold: number;
    status: ScreeningStatus;
  } = {
    movieId: '',
    startsAt: '',
    endsAt: '',
    room: 'Room 1',
    capacity: 120,
    ticketsSold: 0,
    status: 'scheduled',
  };

  count = computed(() => this.screenings().length);

  constructor() {
    this.loadMovies();
    this.reload();
  }

  private loadMovies(): void {
    this.movieService.getMovies().pipe(map((r: any) => r.data)).subscribe({
      next: (movies) => this.movies.set(movies),
      error: () => this.movies.set([]),
    });
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.screeningService.getScreenings().pipe(map((r: any) => r.data)).subscribe({
      next: (screenings) => {
        this.screenings.set(screenings);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load screenings');
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = {
      movieId: '',
      startsAt: '',
      endsAt: '',
      room: 'Room 1',
      capacity: 120,
      ticketsSold: 0,
      status: 'scheduled',
    };
    this.error.set('');
  }

  startEdit(s: Screening): void {
    this.editingId.set(s.id);
    this.form = {
      movieId: s.movieId,
      startsAt: String(s.startsAt).slice(0, 16),
      endsAt: String(s.endsAt).slice(0, 16),
      room: s.room,
      capacity: s.capacity,
      ticketsSold: s.ticketsSold,
      status: s.status,
    };
    this.error.set('');
  }

  onSubmit(): void {
    this.error.set('');
    this.isSaving.set(true);

    const payload = {
      movieId: this.form.movieId,
      startsAt: this.form.startsAt,
      endsAt: this.form.endsAt,
      room: this.form.room,
      capacity: Number(this.form.capacity),
      ticketsSold: Number(this.form.ticketsSold),
      status: this.form.status,
    };

    const req$ = this.editingId()
      ? this.screeningService.updateScreening(this.editingId()!, payload)
      : this.screeningService.createScreening(payload);

    req$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.resetForm();
        this.reload();
      },
      error: (err: any) => {
        this.isSaving.set(false);
        this.error.set(err?.error?.message || 'Save failed');
      },
    });
  }

  remove(s: Screening): void {
    if (!confirm('Delete this screening?')) return;
    this.error.set('');
    this.isDeletingId.set(s.id);
    this.screeningService.deleteScreening(s.id).subscribe({
      next: () => {
        this.isDeletingId.set(null);
        this.reload();
      },
      error: (err: any) => {
        this.isDeletingId.set(null);
        this.error.set(err?.error?.message || 'Delete failed');
      },
    });
  }
}
