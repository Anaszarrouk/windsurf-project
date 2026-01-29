import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { AdminUserService, AdminUser } from '../../../services/admin-user.service';
import { TaskService, Task } from '../../../services/task.service';
import { ScreeningService, Screening } from '../../../services/screening.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="page-title">Settings</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">System Status</h3>
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
            <div class="label">Users</div>
            <div class="value">{{ usersCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Admins</div>
            <div class="value">{{ adminsCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Managers</div>
            <div class="value">{{ managersCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Banned</div>
            <div class="value">{{ bannedCount() }}</div>
          </div>
        </div>

        <div class="grid" style="margin-top: 12px;">
          <div class="card stat">
            <div class="label">Today’s Screenings</div>
            <div class="value">{{ screeningsTodayCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Pending Tasks</div>
            <div class="value">{{ pendingTasksCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Completed Tasks</div>
            <div class="value">{{ completedTasksCount() }}</div>
          </div>
          <div class="card stat">
            <div class="label">API</div>
            <div class="value" style="font-size: 14px; font-weight: 700;">http://localhost:3000</div>
          </div>
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
export class AdminSettingsComponent {
  private adminUserService = inject(AdminUserService);
  private taskService = inject(TaskService);
  private screeningService = inject(ScreeningService);

  isLoading = signal(true);
  error = signal<string>('');

  users = signal<AdminUser[]>([]);
  tasks = signal<Task[]>([]);
  today = signal<Screening[]>([]);

  usersCount = computed(() => this.users().length);
  adminsCount = computed(() => this.users().filter((u) => u.role === 'admin').length);
  managersCount = computed(() => this.users().filter((u) => u.role === 'manager').length);
  bannedCount = computed(() => this.users().filter((u) => !!u.banned).length);

  screeningsTodayCount = computed(() => this.today().length);

  pendingTasksCount = computed(() => this.tasks().filter((t) => t.status !== 'Finalisé').length);
  completedTasksCount = computed(() => this.tasks().filter((t) => t.status === 'Finalisé').length);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);

    this.adminUserService.getUsers().pipe(map((r: any) => r.data as AdminUser[])).subscribe({
      next: (users: AdminUser[]) => this.users.set(users || []),
      error: () => this.users.set([]),
    });

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
        this.error.set(err?.error?.message || 'Failed to load settings data');
      },
    });
  }
}
