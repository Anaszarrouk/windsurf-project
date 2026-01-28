import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _items = signal<AppNotification[]>([]);

  readonly items = this._items.asReadonly();

  show(message: string, type: NotificationType = 'info', durationMs = 3500): void {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: AppNotification = { id, message, type };

    this._items.update((prev) => [...prev, item]);

    if (durationMs > 0) {
      window.setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  success(message: string, durationMs = 3000): void {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs = 4000): void {
    this.show(message, 'error', durationMs);
  }

  info(message: string, durationMs = 3500): void {
    this.show(message, 'info', durationMs);
  }

  dismiss(id: string): void {
    this._items.update((prev) => prev.filter((n) => n.id !== id));
  }

  clear(): void {
    this._items.set([]);
  }
}
