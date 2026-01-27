import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Screening, ScreeningService, ScreeningStatus } from '../../../services/screening.service';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="page-title">Bookings</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">Today’s Bookings (by screening)</h3>
        <button class="btn btn-secondary" type="button" (click)="reload()">Refresh</button>
      </div>

      <div style="color:#888; font-size: 12px; margin-top: 6px;">
        This project doesn’t have a separate Booking entity yet. For now, we treat <strong>ticketsSold</strong> on a screening as the bookings count.
      </div>

      @if (error()) {
        <div class="error" style="margin-top: 10px;">{{ error() }}</div>
      }

      @if (isLoading()) {
        <p style="margin-top: 10px;">Loading…</p>
      } @else {
        <div class="grid" style="margin-top: 10px;">
          <div class="card stat">
            <div class="label">Screenings</div>
            <div class="value">{{ count() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Tickets Sold</div>
            <div class="value">{{ ticketsSold() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Avg Occupancy</div>
            <div class="value">{{ avgOccupancy() | number:'1.0-0' }}%</div>
          </div>
          <div class="card stat">
            <div class="label">Low Booking Alerts</div>
            <div class="value">{{ lowBookings() }}</div>
          </div>
        </div>

        <div class="table-wrap" style="margin-top: 12px;">
          <table class="table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Time</th>
                <th>Room</th>
                <th style="width: 220px;">Tickets Sold</th>
                <th style="width: 220px;">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (s of screenings(); track s.id) {
                <tr>
                  <td style="font-weight:700;">{{ s.movie?.title || s.movieId }}</td>
                  <td style="white-space:nowrap;">
                    <div style="font-weight:700;">{{ s.startsAt | date:'shortTime' }}</div>
                    <div style="color:#888; font-size: 12px;">→ {{ s.endsAt | date:'shortTime' }}</div>
                  </td>
                  <td>{{ s.room }}</td>
                  <td>
                    <div style="display:flex; gap: 8px; align-items:center;">
                      <input type="number" min="0" [ngModel]="draftTickets[s.id]" (ngModelChange)="draftTickets[s.id] = $event" />
                      <button class="btn btn-primary" type="button" (click)="saveTickets(s)" [disabled]="busyId() === s.id">Save</button>
                    </div>
                    <div style="color:#888; font-size: 12px; margin-top: 6px;">Capacity: {{ s.capacity }}</div>
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
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .stat { padding: 14px; }
    .label { color:#888; font-size: 12px; }
    .value { font-size: 22px; font-weight: 800; margin-top: 6px; }
    input, select {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
    }
    .table-wrap { overflow:auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
    .error {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229,9,20,0.12);
      border: 1px solid rgba(229,9,20,0.35);
      color: #ffd7da;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ManagerBookingsComponent {
  private screeningService = inject(ScreeningService);

  screenings = signal<Screening[]>([]);
  isLoading = signal(true);
  error = signal<string>('');
  busyId = signal<string | null>(null);

  statuses: ScreeningStatus[] = ['scheduled', 'in_progress', 'completed', 'cancelled'];
  draftTickets: Record<string, number> = {};

  count = computed(() => this.screenings().length);
  ticketsSold = computed(() => this.screenings().reduce((sum, s) => sum + (Number(s.ticketsSold) || 0), 0));

  avgOccupancy = computed(() => {
    const list = this.screenings();
    if (!list.length) return 0;
    const percents = list.map((s) => {
      const cap = Number(s.capacity) || 0;
      const sold = Number(s.ticketsSold) || 0;
      if (cap <= 0) return 0;
      return (sold / cap) * 100;
    });
    return percents.reduce((a, b) => a + b, 0) / percents.length;
  });

  lowBookings = computed(() => this.screenings().filter((s) => (Number(s.ticketsSold) || 0) <= 3).length);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.screeningService.getToday().pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => {
        const list = screenings || [];
        this.screenings.set(list);
        this.draftTickets = {};
        for (const s of list) {
          this.draftTickets[s.id] = Number(s.ticketsSold) || 0;
        }
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load bookings');
      },
    });
  }

  saveTickets(screening: Screening): void {
    this.error.set('');
    this.busyId.set(screening.id);
    const ticketsSold = Math.max(0, Number(this.draftTickets[screening.id]) || 0);
    this.screeningService.updateScreening(screening.id, { ticketsSold }).subscribe({
      next: () => {
        this.busyId.set(null);
        this.reload();
      },
      error: (err: any) => {
        this.busyId.set(null);
        this.error.set(err?.error?.message || 'Failed to update tickets sold');
      },
    });
  }

  setStatus(screening: Screening, status: ScreeningStatus): void {
    if (status === screening.status) return;
    this.error.set('');
    this.busyId.set(screening.id);
    this.screeningService.updateScreening(screening.id, { status }).subscribe({
      next: () => {
        this.busyId.set(null);
        this.reload();
      },
      error: (err: any) => {
        this.busyId.set(null);
        this.error.set(err?.error?.message || 'Failed to update status');
      },
    });
  }
}
