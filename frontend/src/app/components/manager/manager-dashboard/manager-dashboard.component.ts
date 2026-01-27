import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Screening, ScreeningService } from '../../../services/screening.service';
import { Task, TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="page-title">Manager Dashboard</h1>

    <div class="grid">
      <div class="card stat">
        <div class="label">Today’s Screenings</div>
        <div class="value">{{ screeningsCount() }}</div>
      </div>
      <div class="card stat">
        <div class="label">Tickets Sold (Today)</div>
        <div class="value">{{ ticketsSold() }}</div>
      </div>
      <div class="card stat">
        <div class="label">Avg Occupancy</div>
        <div class="value">{{ avgOccupancy() | number:'1.0-0' }}%</div>
      </div>
      <div class="card stat">
        <div class="label">Pending Tasks</div>
        <div class="value">{{ pendingTasks() }}</div>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">Today Overview</h3>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (s of today(); track s.id) {
                <tr>
                  <td style="white-space:nowrap;">
                    <div style="font-weight:700;">{{ s.startsAt | date:'shortTime' }}</div>
                    <div style="color:#888; font-size: 12px;">→ {{ s.endsAt | date:'shortTime' }}</div>
                  </td>
                  <td style="font-weight:700;">{{ s.movie?.title || s.movieId }}</td>
                  <td>{{ s.room }}</td>
                  <td style="color:#bbb;">{{ s.ticketsSold }}/{{ s.capacity }}</td>
                  <td>{{ s.status }}</td>
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

    <div class="card" style="margin-top: 16px;">
      <h3 style="margin-top:0;">Alerts</h3>
      @if (alerts().length > 0) {
        <div class="alerts">
          @for (a of alerts(); track a) {
            <div class="alert-item">{{ a }}</div>
          }
        </div>
      } @else {
        <p style="color:#888;">No alerts.</p>
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
    .alerts { display: grid; gap: 8px; margin-top: 10px; }
    .alert-item {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229, 9, 20, 0.10);
      border: 1px solid rgba(229, 9, 20, 0.25);
      color: #ffd7da;
    }
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
export class ManagerDashboardComponent {
  private screeningService = inject(ScreeningService);
  private taskService = inject(TaskService);

  isLoading = signal(true);
  error = signal<string>('');
  today = signal<Screening[]>([]);
  tasks = signal<Task[]>([]);

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

  pendingTasks = computed(() => this.tasks().filter((t) => t.status !== 'Finalisé').length);

  alerts = computed(() => {
    const alerts: string[] = [];
    const screenings = this.today() || [];

    const lowSeats = screenings.filter((s) => {
      const cap = Number(s.capacity) || 0;
      const sold = Number(s.ticketsSold) || 0;
      if (cap <= 0) return false;
      return sold / cap >= 0.85;
    });
    if (lowSeats.length > 0) alerts.push(`Low seat availability: ${lowSeats.length} screening(s) at 85%+ capacity.`);

    const lowBookings = screenings.filter((s) => (Number(s.ticketsSold) || 0) <= 3);
    if (lowBookings.length > 0) alerts.push(`Low bookings: ${lowBookings.length} screening(s) with 3 or fewer tickets sold.`);

    const pending = this.tasks().filter((t) => t.status !== 'Finalisé');
    if (pending.length > 0) alerts.push(`Tasks pending: ${pending.length} task(s) not completed.`);

    return alerts;
  });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);

    this.taskService.getTasks().pipe(map((r: any) => r.data as Task[])).subscribe({
      next: (tasks) => this.tasks.set(tasks || []),
      error: () => this.tasks.set([]),
    });

    this.screeningService.getToday().pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => {
        this.today.set(screenings || []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load manager dashboard');
      },
    });
  }
}
