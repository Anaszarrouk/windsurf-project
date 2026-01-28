import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-host" aria-live="polite" aria-atomic="true">
      @for (n of items(); track n.id) {
        <div class="toast" [class.success]="n.type === 'success'" [class.error]="n.type === 'error'" [class.info]="n.type === 'info'">
          <div class="toast-message">{{ n.message }}</div>
          <button type="button" class="toast-close" (click)="dismiss(n.id)" aria-label="Close notification">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-host {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: min(360px, calc(100vw - 32px));
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: start;
      padding: 12px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(15,15,15,0.92);
      color: #fff;
      box-shadow: 0 8px 22px rgba(0,0,0,0.35);
    }

    .toast.success {
      border-color: rgba(46, 204, 113, 0.35);
    }

    .toast.error {
      border-color: rgba(229, 9, 20, 0.45);
    }

    .toast.info {
      border-color: rgba(52, 152, 219, 0.35);
    }

    .toast-message {
      line-height: 1.35;
      word-break: break-word;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.8);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
    }

    .toast-close:hover {
      color: #fff;
    }
  `],
})
export class NotificationHostComponent {
  private readonly notificationService = inject(NotificationService);

  items = this.notificationService.items;

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
