import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Screening, ScreeningService, ScreeningStatus } from '../../../services/screening.service';

@Component({
  selector: 'app-manager-screenings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="page-title">Today’s Screenings</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">Timeline</h3>
        <button class="btn btn-secondary" type="button" (click)="reload()">Refresh</button>
      </div>

      @if (error()) {
        <div class="error" style="margin-top: 10px;">{{ error() }}</div>
      }

      @if (isLoading()) {
        <p style="margin-top: 10px;">Loading…</p>
      } @else {
        <div class="table-wrap" style="margin-top: 10px;">
          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Movie</th>
                <th>Room</th>
                <th>Occupancy</th>
                <th style="width: 220px;">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (s of screenings(); track s.id) {
                <tr>
                  <td style="white-space:nowrap;">
                    <div style="font-weight:700;">{{ s.startsAt | date:'shortTime' }}</div>
                    <div style="color:#888; font-size: 12px;">→ {{ s.endsAt | date:'shortTime' }}</div>
                  </td>
                  <td>
                    <div style="font-weight:700;">{{ s.movie?.title || s.movieId }}</div>
                    <div style="color:#888; font-size:12px;">{{ s.status }}</div>
                  </td>
                  <td>{{ s.room }}</td>
                  <td>
                    <div>{{ s.ticketsSold }}/{{ s.capacity }}</div>
                    <div class="bar">
                      <div class="fill" [style.width.%]="occupancyPercent(s)"></div>
                    </div>
                  </td>
                  <td>
                    <div style="display:flex; gap: 8px; align-items:center;">
                      <select [ngModel]="s.status" (ngModelChange)="setStatus(s, $event)" [disabled]="busyId() === s.id">
                        @for (st of statuses; track st) {
                          <option [ngValue]="st">{{ st }}</option>
                        }
                      </select>
                      @if (busyId() === s.id) {
                        <span style="color:#888;">Saving…</span>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" style="color:#888;">No screenings today.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div style="margin-top: 10px; color:#888;">{{ count() }} screenings</div>
      }
    </div>
  `,
  styles: [`
    .table-wrap { overflow: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
    select {
      width: 100%;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
    }
    .bar {
      height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      overflow: hidden;
      margin-top: 6px;
      width: 140px;
    }
    .fill {
      height: 100%;
      background: rgba(229,9,20,0.7);
    }
    .error {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #ffd7da;
    }
  `],
})
export class ManagerScreeningsComponent {
  private screeningService = inject(ScreeningService);

  screenings = signal<Screening[]>([]);
  isLoading = signal(true);
  error = signal<string>('');
  busyId = signal<string | null>(null);

  statuses: ScreeningStatus[] = ['scheduled', 'in_progress', 'completed', 'cancelled'];

  count = computed(() => this.screenings().length);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.screeningService.getToday().pipe(map((r) => r.data)).subscribe({
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

  occupancyPercent(s: Screening): number {
    if (!s.capacity) return 0;
    const p = (s.ticketsSold / s.capacity) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }

  setStatus(screening: Screening, status: ScreeningStatus): void {
    if (status === screening.status) return;
    this.error.set('');
    this.busyId.set(screening.id);
    this.screeningService.updateScreening(screening.id, { status }).pipe(map((r) => r.data)).subscribe({
      next: (updated) => {
        this.screenings.update((list) => list.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
        this.busyId.set(null);
      },
      error: (err) => {
        this.busyId.set(null);
        this.error.set(err?.error?.message || 'Failed to update status');
        this.reload();
      },
    });
  }
}
