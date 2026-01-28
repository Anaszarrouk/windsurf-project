import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Report, ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-manager-user-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="page-title">User Reports (Inbox)</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <div>
          <div style="font-weight: 800;">Open: {{ openCount() }}</div>
          <div style="color:#888; font-size: 12px;">Total: {{ reports().length }}</div>
        </div>
        <button class="btn btn-secondary" type="button" (click)="reload()" [disabled]="isLoading()">Refresh</button>
      </div>

      @if (isLoading()) {
        <p style="margin-top: 12px;">Loading…</p>
      } @else {
        <div style="margin-top: 12px; display:grid; gap: 12px;">
          @for (r of reports(); track r.id) {
            <div class="card" style="border: 1px solid rgba(255,255,255,0.08);">
              <div style="display:flex; justify-content:space-between; gap: 12px; align-items:flex-start;">
                <div>
                  <div style="font-weight: 800;">
                    {{ r.category.toUpperCase() }}
                    <span style="color:#888; font-weight: 600;">· {{ r.status.toUpperCase() }}</span>
                  </div>
                  <div style="color:#888; font-size: 12px; margin-top: 4px;">
                    By: {{ r.user?.username || r.userId }} · {{ r.createdAt | date:'short' }}
                  </div>
                  @if (r.movieId) {
                    <div style="color:#888; font-size: 12px; margin-top: 4px;">Movie: {{ r.movieId }}</div>
                  }
                  @if (r.reviewId) {
                    <div style="color:#888; font-size: 12px; margin-top: 4px;">Review: {{ r.reviewId }}</div>
                  }
                </div>

                <div style="display:flex; gap: 8px; flex-wrap: wrap; justify-content:flex-end;">
                  <button class="btn btn-primary" type="button" (click)="resolve(r)" [disabled]="isBusy(r.id) || r.status === 'resolved'">
                    Resolve
                  </button>
                  <button class="btn btn-secondary" type="button" (click)="remove(r)" [disabled]="isBusy(r.id)">
                    Delete
                  </button>
                </div>
              </div>

              <div style="margin-top: 10px; color:#ddd; white-space: pre-wrap;">{{ r.message }}</div>

              @if (r.status === 'resolved') {
                <div style="margin-top: 10px; color:#888; font-size: 12px;">
                  Resolved: {{ r.resolvedAt | date:'short' }}
                  @if (r.resolvedByUser?.username) {
                    <span>· By {{ r.resolvedByUser?.username }}</span>
                  }
                </div>
              }
            </div>
          } @empty {
            <div class="card"><p style="color:#888;">No reports yet.</p></div>
          }
        </div>
      }
    </div>
  `,
})
export class ManagerUserReportsComponent {
  private reportService = inject(ReportService);
  private notificationService = inject(NotificationService);

  isLoading = signal(true);
  reports = signal<Report[]>([]);
  busyIds = signal<Record<string, boolean>>({});

  openCount = computed(() => this.reports().filter((r) => r.status === 'open').length);

  constructor() {
    this.reload();
  }

  isBusy(id: string): boolean {
    return !!this.busyIds()[id];
  }

  private setBusy(id: string, value: boolean): void {
    this.busyIds.update((prev) => ({ ...prev, [id]: value }));
  }

  reload(): void {
    this.isLoading.set(true);
    this.reportService.listReportsForStaff().subscribe({
      next: (list) => {
        this.reports.set(list || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.error('Failed to load reports.');
      },
    });
  }

  resolve(r: Report): void {
    if (r.status === 'resolved') return;
    this.setBusy(r.id, true);
    this.reportService.resolveReport(r.id).subscribe({
      next: (updated) => {
        this.setBusy(r.id, false);
        this.reports.update((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
        this.notificationService.success('Report resolved.');
      },
      error: () => {
        this.setBusy(r.id, false);
        this.notificationService.error('Could not resolve the report.');
      },
    });
  }

  remove(r: Report): void {
    this.setBusy(r.id, true);
    this.reportService.deleteReport(r.id).subscribe({
      next: () => {
        this.setBusy(r.id, false);
        this.reports.update((prev) => prev.filter((x) => x.id !== r.id));
        this.notificationService.success('Report deleted.');
      },
      error: () => {
        this.setBusy(r.id, false);
        this.notificationService.error('Could not delete the report.');
      },
    });
  }
}
