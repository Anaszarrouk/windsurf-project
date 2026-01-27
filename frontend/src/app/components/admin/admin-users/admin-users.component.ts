import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { AdminUser, AdminUserService } from '../../../services/admin-user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="page-title">Users Management</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">All Users</h3>
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
                <th>Username</th>
                <th>Email</th>
                <th style="width: 160px;">Role</th>
                <th style="width: 120px;">Status</th>
                <th style="width: 320px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (u of users(); track u.id) {
                <tr>
                  <td style="font-weight:700;">{{ u.username }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <select [ngModel]="u.role" (ngModelChange)="onRoleChange(u, $event)" [disabled]="busyUserId() === u.id">
                      <option value="admin">admin</option>
                      <option value="manager">manager</option>
                      <option value="user">user</option>
                    </select>
                  </td>
                  <td>
                    @if (u.banned) {
                      <span class="badge badge-danger">Banned</span>
                    } @else {
                      <span class="badge badge-ok">Active</span>
                    }
                  </td>
                  <td>
                    <div class="row-actions">
                      @if (u.banned) {
                        <button class="btn btn-secondary" type="button" (click)="setBanned(u, false)" [disabled]="busyUserId() === u.id">Unban</button>
                      } @else {
                        <button class="btn btn-danger" type="button" (click)="setBanned(u, true)" [disabled]="busyUserId() === u.id">Ban</button>
                      }
                      <button class="btn btn-secondary" type="button" (click)="resetPassword(u)" [disabled]="busyUserId() === u.id">Reset password</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" style="color:#888;">No users found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div style="margin-top: 10px; color:#888;">{{ usersCount() }} users</div>
      }
    </div>
  `,
  styles: [`
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
    select {
      width: 100%;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(0,0,0,0.15);
      color: inherit;
    }
    .row-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .badge-ok {
      background: rgba(0, 200, 83, 0.12);
      border-color: rgba(0, 200, 83, 0.35);
      color: #bff3d1;
    }
    .badge-danger {
      background: rgba(229,9,20,0.12);
      border-color: rgba(229,9,20,0.35);
      color: #ffd7da;
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
export class AdminUsersComponent {
  private adminUserService = inject(AdminUserService);

  users = signal<AdminUser[]>([]);
  isLoading = signal(true);
  busyUserId = signal<string | null>(null);
  error = signal<string>('');

  usersCount = computed(() => this.users().length);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.adminUserService.getUsers().pipe(map((r) => r.data)).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load users');
        this.isLoading.set(false);
      },
    });
  }

  onRoleChange(user: AdminUser, role: string): void {
    if (role === user.role) {
      return;
    }
    this.error.set('');
    this.busyUserId.set(user.id);
    this.adminUserService.updateRole(user.id, role).pipe(map((r) => r.data)).subscribe({
      next: (updated) => {
        this.users.update((list) => list.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
        this.busyUserId.set(null);
      },
      error: (err) => {
        this.busyUserId.set(null);
        this.error.set(err?.error?.message || 'Failed to update role');
        this.reload();
      },
    });
  }

  setBanned(user: AdminUser, banned: boolean): void {
    if (banned && !confirm(`Ban "${user.username}"?`)) {
      return;
    }
    if (!banned && !confirm(`Unban "${user.username}"?`)) {
      return;
    }
    this.error.set('');
    this.busyUserId.set(user.id);
    this.adminUserService.setBanned(user.id, banned).pipe(map((r) => r.data)).subscribe({
      next: (updated) => {
        this.users.update((list) => list.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
        this.busyUserId.set(null);
      },
      error: (err) => {
        this.busyUserId.set(null);
        this.error.set(err?.error?.message || 'Failed to update ban status');
      },
    });
  }

  resetPassword(user: AdminUser): void {
    const newPassword = prompt(`Enter new password for ${user.username}:`);
    if (!newPassword) {
      return;
    }
    this.error.set('');
    this.busyUserId.set(user.id);
    this.adminUserService.resetPassword(user.id, newPassword).subscribe({
      next: () => {
        this.busyUserId.set(null);
        alert('Password reset');
      },
      error: (err) => {
        this.busyUserId.set(null);
        this.error.set(err?.error?.message || 'Failed to reset password');
      },
    });
  }
}
