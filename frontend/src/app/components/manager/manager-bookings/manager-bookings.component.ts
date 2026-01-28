import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Booking, BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="page-title">Bookings</h2>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px;">
        <h3 style="margin:0;">Today’s Bookings</h3>
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
            <div class="label">Bookings</div>
            <div class="value">{{ count() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Seats Booked</div>
            <div class="value">{{ seatsBooked() }}</div>
          </div>
          <div class="card stat">
            <div class="label">Revenue</div>
            <div class="value">{{ revenue() | number:'1.2-2' }}</div>
          </div>
          <div class="card stat">
            <div class="label">Cancelled/Refunded</div>
            <div class="value">{{ cancelledOrRefunded() }}</div>
          </div>
        </div>

        <div class="table-wrap" style="margin-top: 12px;">
          <table class="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Movie</th>
                <th>Screening</th>
                <th style="width: 140px;">Seats</th>
                <th style="width: 160px;">Total</th>
                <th style="width: 140px;">Status</th>
                <th style="width: 220px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (b of bookings(); track b.id) {
                <tr>
                  <td>
                    <div style="font-weight:700;">{{ b.user?.username || b.userId }}</div>
                    <div style="color:#888; font-size:12px;">{{ b.user?.email }}</div>
                  </td>
                  <td style="font-weight:700;">{{ b.screening?.movie?.title || b.screeningId }}</td>
                  <td style="white-space:nowrap;">
                    <div style="font-weight:700;">{{ b.screening?.startsAt | date:'short' }}</div>
                    <div style="color:#888; font-size:12px;">Room: {{ b.screening?.room }}</div>
                  </td>
                  <td>{{ b.seatsCount }}</td>
                  <td>{{ b.totalPrice | number:'1.2-2' }}</td>
                  <td>{{ b.status }}</td>
                  <td>
                    <div style="display:flex; gap: 8px; align-items:center;">
                      <button class="btn btn-secondary" type="button" (click)="cancel(b, 'cancelled')" [disabled]="busyId() === b.id || b.status !== 'paid'">Cancel</button>
                      <button class="btn btn-danger" type="button" (click)="cancel(b, 'refunded')" [disabled]="busyId() === b.id || b.status !== 'paid'">Refund</button>
                      @if (busyId() === b.id) {
                        <span style="color:#888;">Saving…</span>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" style="color:#888;">No bookings found for today.</td>
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
export class ManagerBookingsComponent {
  private bookingService = inject(BookingService);

  bookings = signal<Booking[]>([]);
  isLoading = signal(true);
  error = signal<string>('');
  busyId = signal<string | null>(null);

  count = computed(() => this.bookings().length);
  seatsBooked = computed(() => this.bookings().reduce((sum, b) => sum + (Number(b.seatsCount) || 0), 0));
  revenue = computed(() => this.bookings().reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0));
  cancelledOrRefunded = computed(() => this.bookings().filter((b) => b.status !== 'paid').length);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.error.set('');
    this.isLoading.set(true);
    this.bookingService.getBookings(this.todayStr()).pipe(map((r: any) => r.data as Booking[])).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings || []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load bookings');
      },
    });
  }

  cancel(booking: Booking, status: 'cancelled' | 'refunded'): void {
    if (booking.status !== 'paid') return;
    const msg = status === 'refunded' ? 'Refund this booking?' : 'Cancel this booking?';
    if (!confirm(msg)) return;

    this.error.set('');
    this.busyId.set(booking.id);
    this.bookingService.cancelBooking(booking.id, status).subscribe({
      next: () => {
        this.busyId.set(null);
        this.reload();
      },
      error: (err: any) => {
        this.busyId.set(null);
        this.error.set(err?.error?.message || 'Failed to update booking');
      },
    });
  }

  private todayStr(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
