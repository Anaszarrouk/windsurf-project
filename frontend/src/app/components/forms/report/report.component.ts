import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { CreateReportPayload, ReportCategory, ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" style="max-width: 720px; margin: 0 auto;">
      <h2 style="margin-top: 0; color:#e50914;">Report an Issue</h2>
      <p style="color:#bbb; margin-top: 8px;">
        Tell us what went wrong. A manager/admin will review it.
      </p>

      <div class="form-group" style="margin-top: 14px;">
        <label>Category</label>
        <select [(ngModel)]="model.category">
          @for (c of categories; track c.value) {
            <option [ngValue]="c.value">{{ c.label }}</option>
          }
        </select>
      </div>

      <div class="form-group" style="margin-top: 12px;">
        <label>Message</label>
        <textarea rows="5" [(ngModel)]="model.message" placeholder="Describe the problem (min 10 characters)"></textarea>
      </div>

      <div class="grid" style="margin-top: 12px;">
        <div class="form-group">
          <label>Movie ID (optional)</label>
          <input type="text" [(ngModel)]="model.movieId" placeholder="UUID" />
        </div>
        <div class="form-group">
          <label>Review ID (optional)</label>
          <input type="text" [(ngModel)]="model.reviewId" placeholder="UUID" />
        </div>
      </div>

      <div class="actions" style="margin-top: 14px;">
        <button class="btn btn-primary" type="button" [disabled]="isSubmitting || !canSubmit()" (click)="submit()">
          {{ isSubmitting ? 'Submitting…' : 'Submit report' }}
        </button>
      </div>

      <p style="margin-top: 12px; color:#888; font-size: 12px;">
        Tip: You can leave Movie/Review blank if it’s a general issue.
      </p>
    </div>
  `,
  styles: [`
    textarea, input, select {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #333;
      background: #1a1a1a;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ReportComponent {
  private reportService = inject(ReportService);
  private notificationService = inject(NotificationService);

  isSubmitting = false;

  categories: Array<{ value: ReportCategory; label: string }> = [
    { value: 'bug', label: 'Bug' },
    { value: 'payment', label: 'Payment' },
    { value: 'content', label: 'Content' },
    { value: 'other', label: 'Other' },
  ];

  model: CreateReportPayload & { movieId: string; reviewId: string } = {
    category: 'other',
    message: '',
    movieId: '',
    reviewId: '',
  };

  canSubmit(): boolean {
    const msg = (this.model.message || '').trim();
    return msg.length >= 10;
  }

  submit(): void {
    if (!this.canSubmit()) return;

    const payload: CreateReportPayload = {
      category: this.model.category,
      message: (this.model.message || '').trim(),
      movieId: (this.model.movieId || '').trim() || undefined,
      reviewId: (this.model.reviewId || '').trim() || undefined,
    };

    this.isSubmitting = true;

    this.reportService.createReport(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.model.message = '';
        this.model.movieId = '';
        this.model.reviewId = '';
        this.notificationService.success('Thanks! Your report has been sent.');
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const status: number | undefined = err?.status;
        const message =
          status === 400 ? 'Please write a longer message and try again.' :
          status === 401 || status === 403 ? 'Please log in to submit a report.' :
          status === 0 ? 'Cannot reach the server. Please try again.' :
          'Could not submit your report. Please try again.';
        this.notificationService.error(message);
      },
    });
  }
}
