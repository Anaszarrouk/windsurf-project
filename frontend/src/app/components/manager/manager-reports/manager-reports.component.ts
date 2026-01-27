import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Screening, ScreeningService } from '../../../services/screening.service';

@Component({
  selector: 'app-manager-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="page-title">Reports</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">Daily Summary (Today)</h3>
        <button class="btn btn-secondary" type="button" (click)="reload()">Refresh</button>
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
            <div class="value">{{ screeningsCount() }}</div>
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
            <div class="label">Low Booking Screenings</div>
            <div class="value">{{ lowBookings() }}</div>
          </div>
        </div>

        <div class="table-wrap" style="margin-top: 12px;">
          <table class="table">
            <thead>
              <tr>
                <th>Top Movies (Today)</th>
                <th style="width: 160px;">Tickets</th>
                <th style="width: 180px;">Avg Occupancy</th>
              </tr>
            </thead>
            <tbody>
              @for (row of topMovies(); track row.movieId) {
                <tr>
                  <td style="font-weight:700;">{{ row.title }}</td>
                  <td>{{ row.tickets }}</td>
                  <td>{{ row.occupancy | number:'1.0-0' }}%</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="3" style="color:#888;">No screenings today.</td>
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
export class ManagerReportsComponent {
  private screeningService = inject(ScreeningService);

  isLoading = signal(true);
  error = signal<string>('');
  today = signal<Screening[]>([]);

  screeningsCount = computed(() => this.today().length);
  ticketsSold = computed(() => this.today().reduce((sum, s) => sum + (Number(s.ticketsSold) || 0), 0));

  avgOccupancy = computed(() => {
    const list = this.today();
    if (!list.length) return 0;
    const percents = list.map((s) => {
      const cap = Number(s.capacity) || 0;
      const sold = Number(s.ticketsSold) || 0;
      if (cap <= 0) return 0;
      return (sold / cap) * 100;
    });
    return percents.reduce((a, b) => a + b, 0) / percents.length;
  });

  lowBookings = computed(() => this.today().filter((s) => (Number(s.ticketsSold) || 0) <= 3).length);

  topMovies = computed(() => {
    const byMovie: Record<string, { movieId: string; title: string; tickets: number; occupancy: number; occCount: number }> = {};

    for (const s of this.today()) {
      const movieId = s.movieId;
      const title = (s as any)?.movie?.title || movieId;
      const sold = Number(s.ticketsSold) || 0;
      const cap = Number(s.capacity) || 0;
      const occ = cap > 0 ? (sold / cap) * 100 : 0;

      if (!byMovie[movieId]) {
        byMovie[movieId] = { movieId, title, tickets: 0, occupancy: 0, occCount: 0 };
      }
      byMovie[movieId].tickets += sold;
      byMovie[movieId].occupancy += occ;
      byMovie[movieId].occCount += 1;
    }

    return Object.values(byMovie)
      .map((r) => ({
        movieId: r.movieId,
        title: r.title,
        tickets: r.tickets,
        occupancy: r.occCount ? r.occupancy / r.occCount : 0,
      }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 10);
  });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.screeningService.getToday().pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => {
        this.today.set(screenings || []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load reports');
      },
    });
  }
}
