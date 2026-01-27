import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { MovieService } from '../../../services/movie.service';
import { ScreeningService, Screening } from '../../../services/screening.service';
import { TaskService, Task } from '../../../services/task.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="page-title">Admin Dashboard</h1>
    <div class="grid">
      <div class="card">
        <h3>Total Movies</h3>
        <p class="metric">{{ totalMovies() ?? '—' }}</p>
      </div>
      <div class="card">
        <h3>Today’s Screenings</h3>
        <p class="metric">{{ todaysScreenings() ?? '—' }}</p>
      </div>
      <div class="card">
        <h3>Tickets Sold Today</h3>
        <p class="metric">{{ ticketsSoldToday() ?? '—' }}</p>
      </div>
      <div class="card">
        <h3>Revenue Today</h3>
        <p class="metric">{{ revenueToday() != null ? (revenueToday()! | number:'1.2-2') : '—' }}</p>
      </div>
    </div>
    <div class="card" style="margin-top: 20px;">
      <h3>Alerts</h3>
      @if (isLoading()) {
        <p>Loading…</p>
      } @else {
        @if (alerts().length > 0) {
          <div class="alerts">
            @for (a of alerts(); track a) {
              <div class="alert-item">{{ a }}</div>
            }
          </div>
        } @else {
          <p style="color:#888;">No alerts.</p>
        }
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .metric {
      font-size: 22px;
      font-weight: 800;
      margin: 6px 0 0;
    }
    .alerts {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .alert-item {
      padding: 10px;
      border-radius: 10px;
      background: rgba(229, 9, 20, 0.10);
      border: 1px solid rgba(229, 9, 20, 0.25);
      color: #ffd7da;
    }
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminDashboardComponent {
  private movieService = inject(MovieService);
  private screeningService = inject(ScreeningService);
  private taskService = inject(TaskService);

  isLoading = signal(true);

  totalMovies = signal<number | null>(null);
  today = signal<Screening[]>([]);
  tasks = signal<Task[]>([]);

  todaysScreenings = computed(() => {
    const list = this.today();
    return list ? list.length : null;
  });

  ticketsSoldToday = computed(() => {
    const list = this.today();
    if (!list) return null;
    return list.reduce((sum, s) => sum + (Number(s.ticketsSold) || 0), 0);
  });

  revenueToday = computed(() => {
    const list = this.today();
    if (!list) return null;

    const parsePrice = (raw: any): number => {
      if (raw == null || raw === '') return 0;
      const n = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(n) ? n : 0;
    };

    return list.reduce((sum, s) => {
      const price = parsePrice((s as any)?.movie?.price);
      const sold = Number(s.ticketsSold) || 0;
      return sum + price * sold;
    }, 0);
  });

  alerts = computed(() => {
    const alerts: string[] = [];

    const screenings = this.today() || [];

    const lowSeats = screenings.filter((s) => {
      const cap = Number(s.capacity) || 0;
      const sold = Number(s.ticketsSold) || 0;
      if (cap <= 0) return false;
      return sold / cap >= 0.85;
    });

    if (lowSeats.length > 0) {
      alerts.push(`Low seat availability: ${lowSeats.length} screening(s) at 85%+ capacity.`);
    }

    const lowBookings = screenings.filter((s) => (Number(s.ticketsSold) || 0) <= 3);
    if (lowBookings.length > 0) {
      alerts.push(`Low bookings: ${lowBookings.length} screening(s) with 3 or fewer tickets sold.`);
    }

    const tasks = this.tasks() || [];
    const pendingTasks = tasks.filter((t) => t.status !== 'Finalisé');
    if (pendingTasks.length > 0) {
      alerts.push(`Maintenance pending: ${pendingTasks.length} task(s) not completed.`);
    }

    return alerts;
  });

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.isLoading.set(true);

    this.movieService.getMovies().pipe(map((r: any) => r.data)).subscribe({
      next: (movies) => this.totalMovies.set(Array.isArray(movies) ? movies.length : 0),
      error: () => this.totalMovies.set(null),
    });

    this.screeningService.getToday().pipe(map((r: any) => r.data as Screening[])).subscribe({
      next: (screenings) => this.today.set(screenings || []),
      error: () => this.today.set([]),
    });

    this.taskService.getTasks().pipe(map((r: any) => r.data as Task[])).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.tasks.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
