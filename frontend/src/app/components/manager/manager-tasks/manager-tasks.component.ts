import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Task, TaskService, TaskStatus } from '../../../services/task.service';

@Component({
  selector: 'app-manager-tasks',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="page-title">Tasks</h2>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top:0;">{{ editingId() ? 'Edit Task' : 'Add Task' }}</h3>

        <form #f="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Name</label>
            <input name="name" [(ngModel)]="form.name" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea name="description" [(ngModel)]="form.description" rows="3"></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Status</label>
              <select name="status" [(ngModel)]="form.status">
                @for (s of statuses; track s) {
                  <option [ngValue]="s">{{ s }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Date</label>
              <input name="date" type="datetime-local" [(ngModel)]="form.date" />
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
          <h3 style="margin:0;">All Tasks</h3>
          <div style="color:#888;">{{ tasksCount() }} total</div>
        </div>

        @if (isLoading()) {
          <p>Loading…</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style="width: 170px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (t of tasks(); track t.id) {
                  <tr>
                    <td>
                      <div style="font-weight:700;">{{ t.name }}</div>
                      @if (t.description) {
                        <div style="color:#888; font-size: 12px;">{{ t.description }}</div>
                      }
                    </td>
                    <td>
                      <span class="chip" [class.chip-warn]="t.status === 'En attente'" [class.chip-info]="t.status === 'En cours'" [class.chip-ok]="t.status === 'Finalisé'">
                        {{ t.status }}
                      </span>
                    </td>
                    <td style="color:#bbb;">{{ t.date || '—' }}</td>
                    <td>
                      <div class="row-actions">
                        <button class="btn btn-secondary" type="button" (click)="startEdit(t)">Edit</button>
                        <button class="btn btn-danger" type="button" (click)="remove(t)" [disabled]="isDeletingId() === t.id">Delete</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" style="color:#888;">No tasks found.</td>
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
      grid-template-columns: 420px 1fr;
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
    input, select, textarea {
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
    .chip {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .chip-warn {
      background: rgba(255, 193, 7, 0.12);
      border-color: rgba(255, 193, 7, 0.35);
      color: #ffe8b3;
    }
    .chip-info {
      background: rgba(3, 169, 244, 0.12);
      border-color: rgba(3, 169, 244, 0.35);
      color: #cfefff;
    }
    .chip-ok {
      background: rgba(0, 200, 83, 0.12);
      border-color: rgba(0, 200, 83, 0.35);
      color: #bff3d1;
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
export class ManagerTasksComponent {
  private taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeletingId = signal<string | null>(null);
  error = signal<string>('');

  editingId = signal<string | null>(null);

  statuses: TaskStatus[] = ['En attente', 'En cours', 'Finalisé'];

  form: { name: string; description: string; status: TaskStatus; date: string } = {
    name: '',
    description: '',
    status: 'En attente',
    date: '',
  };

  tasksCount = computed(() => this.tasks().length);

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().pipe(map((r) => r.data)).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load tasks');
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = { name: '', description: '', status: 'En attente', date: '' };
    this.error.set('');
  }

  startEdit(task: Task): void {
    this.editingId.set(task.id);
    this.form = {
      name: task.name,
      description: task.description || '',
      status: task.status,
      date: task.date ? String(task.date).slice(0, 16) : '',
    };
    this.error.set('');
  }

  onSubmit(): void {
    this.error.set('');
    this.isSaving.set(true);

    const payload: Partial<Task> = {
      name: this.form.name,
      description: this.form.description || undefined,
      status: this.form.status,
      date: this.form.date || undefined,
    };

    const req$ = this.editingId()
      ? this.taskService.updateTask(this.editingId()!, payload)
      : this.taskService.createTask(payload);

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

  remove(task: Task): void {
    if (!confirm(`Delete "${task.name}"?`)) {
      return;
    }
    this.error.set('');
    this.isDeletingId.set(task.id);
    this.taskService.deleteTask(task.id).subscribe({
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
