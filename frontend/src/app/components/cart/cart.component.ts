import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { AuthService } from '../../services/auth.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';
import { BookingService } from '../../services/booking.service';
import { Screening, ScreeningService } from '../../services/screening.service';
import { NotificationService } from '../../services/notification.service';
import { jsPDF } from 'jspdf';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe, FormsModule],
  template: `
    <div class="cart-container">
      <h1 class="page-title">Cart</h1>

      @if (isEmpty()) {
        <div class="card">
          <p>Your cart is empty.</p>
          <div style="margin-top: 15px;">
            <a class="btn btn-primary" routerLink="/movies">Browse movies</a>
          </div>
        </div>
      } @else {
        <div class="grid grid-2">
          <div class="card">
            <h2 style="margin-bottom: 15px;">Items ({{ itemCount() }})</h2>

            <div class="cart-items">
              @for (movie of items(); track movie.id) {
                <div class="cart-item">
                  <img class="cart-item-img" [src]="movie.poster | defaultImage" [alt]="movie.title" />
                  <div class="cart-item-content">
                    <div class="cart-item-title">{{ movie.title }}</div>
                    <div class="cart-item-info">Director: {{ movie.director }}</div>
                    <div class="cart-item-info">Duration: {{ movie.duration }} minutes</div>
                  </div>
                  <div class="cart-item-actions">
                    <button type="button" class="btn btn-secondary" (click)="remove(movie.id)">Remove</button>
                  </div>
                </div>
              }
            </div>

            <div style="display:flex; gap: 10px; margin-top: 15px;">
              <button type="button" class="btn btn-secondary" (click)="clear()">Clear cart</button>
              <button type="button" class="btn btn-success" (click)="startPay()" [disabled]="isPaying()">Pay</button>
            </div>
          </div>
        </div>
      }
    </div>

    @if (payMode()) {
      <div class="modal-overlay" style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
        <div class="card" style="max-width:600px;width:100%;max-height:80vh;overflow:auto;padding:20px;">
          <h3 style="margin-top:0;">Select screenings & seats</h3>
          @for (item of payItems(); track item.movie.id) {
            <div style="margin-bottom:20px;padding:12px;background:#1a1a1a;border-radius:8px;">
              <div style="font-weight:600;margin-bottom:8px;">{{ item.movie.title }}</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <label>
                  Screening:
                  <select [ngModel]="item.selectedScreeningId()" (ngModelChange)="item.selectedScreeningId.set($event); item.seatsCount.set(1)">
                    @for (s of item.screenings(); track s.id) {
                      <option [ngValue]="s.id">{{ s.startsAt | date:'short' }} – {{ s.room }}</option>
                    }
                  </select>
                </label>
                <label>
                  Seats:
                  <input type="number" min="1" [max]="item.availableSeats()" [ngModel]="item.seatsCount()" (ngModelChange)="item.seatsCount.set($event)" />
                  <small style="color:#888;">Available: {{ item.availableSeats() }}</small>
                </label>
              </div>
            </div>
          }
          <div class="card" style="margin-top:16px;background:#1a1a1a;">
            <h4 style="margin-top:0;">Summary</h4>
            <div style="display:grid;gap:8px;color:#ccc;">
              <div style="display:flex;justify-content:space-between;">
                <span>Total Seats:</span>
                <span>{{ totalSeats() }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span>Total Price:</span>
                <span>{{ totalPrice() | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
            <button type="button" class="btn btn-secondary" (click)="cancelPay()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="downloadBillPdf()">Download bill (PDF)</button>
            <button type="button" class="btn btn-success" (click)="confirmPay()" [disabled]="!canPay()">Confirm Pay</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 90px 1fr auto;
      gap: 12px;
      align-items: center;
      background: #151515;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 10px;
    }

    .cart-item-img {
      width: 90px;
      height: 70px;
      object-fit: cover;
      border-radius: 6px;
    }

    .cart-item-title {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .cart-item-info {
      color: #999;
      font-size: 13px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #2a2a2a;
      color: #ccc;
    }

    .summary-row:last-child {
      border-bottom: none;
      color: #fff;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 70px 1fr;
      }
      .cart-item-actions {
        grid-column: 1 / -1;
      }
    }
  `]
})
export class CartComponent {
  private cart = inject(BookingCartService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private screeningService = inject(ScreeningService);
  private notificationService = inject(NotificationService);

  items = this.cart.items;
  itemCount = this.cart.itemCount;
  isEmpty = this.cart.isEmpty;
  payMode = signal(false);
  payItems = signal<any[]>([]);
  isPaying = signal(false);

  totalSeats = computed(() => {
    return this.payItems().reduce((sum, item) => sum + (item.seatsCount() || 0), 0);
  });

  totalPrice = computed(() => {
    return this.payItems().reduce((sum, item) => {
      const seats = item.seatsCount() || 0;
      const price = this.getMoviePrice(item.movie);
      return sum + (seats * price);
    }, 0);
  });

  customerLabel = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return 'Guest';
    return `${user.username} (${user.email})`;
  });

  billDate = computed(() => new Date().toLocaleString());

  totalAmount = computed(() => {
    const items = this.items();
    return items.reduce((sum, m) => sum + this.getMoviePrice(m), 0);
  });

  canPay = computed(() => {
    return this.payItems().every((item) => {
      const screeningId = item.selectedScreeningId();
      const seats = item.seatsCount();
      const available = item.availableSeats();
      return !!screeningId && seats > 0 && seats <= available;
    });
  });

  remove(movieId: string): void {
    this.cart.removeFromCart(movieId);
  }

  clear(): void {
    this.cart.clearCart();
  }

  startPay(): void {
    const items = this.items();
    const payItems = items.map((movie) => {
      const screenings = signal<Screening[]>([]);
      const selectedScreeningId = signal<string>('');
      const seatsCount = signal<number>(1);

      const availableSeats = computed(() => {
        const screening = screenings().find((s: Screening) => s.id === selectedScreeningId());
        if (!screening) return 0;
        const capacity = Number(screening.capacity) || 0;
        const sold = Number(screening.ticketsSold) || 0;
        return Math.max(0, capacity - sold);
      });

      return { movie, screenings, selectedScreeningId, seatsCount, availableSeats };
    });
    this.payItems.set(payItems);
    this.payMode.set(true);

    // Load screenings for each movie
    for (const pi of payItems) {
      this.screeningService.getScreenings(pi.movie.id).pipe(map((r: any) => r.data as Screening[])).subscribe({
        next: (screenings) => {
          console.log('[startPay] screenings loaded for', pi.movie.title, screenings);
          pi.screenings.set(screenings || []);

          // Default selection (once) to first screening when list arrives.
          if (!pi.selectedScreeningId() && (screenings || []).length > 0) {
            pi.selectedScreeningId.set((screenings || [])[0].id);
            pi.seatsCount.set(1);
          }
        },
        error: (err) => {
          console.error('[startPay] failed to load screenings for', pi.movie.title, err);
          pi.screenings.set([]);
        },
      });
    }
  }

  cancelPay(): void {
    this.payMode.set(false);
    this.payItems.set([]);
  }

  async confirmPay(): Promise<void> {
    this.isPaying.set(true);
    try {
      const items = this.payItems();
      for (const item of items) {
        const screeningId = item.selectedScreeningId();
        const seatsCount = item.seatsCount();
        await this.bookingService.createBooking({ screeningId, seatsCount }).toPromise();
      }
      this.notificationService.success('Payment successful! Bookings created.');
      // Refresh screenings to reflect updated ticketsSold
      for (const item of items) {
        this.screeningService.getScreenings(item.movie.id).pipe(map((r: any) => r.data as Screening[])).subscribe({
          next: (screenings) => item.screenings.set(screenings || []),
          error: () => {},
        });
      }
      this.cart.clearCart();
      this.cancelPay();
    } catch (err: any) {
      const msg = err?.error?.message || 'Payment failed. Please try again.';
      if (msg.includes('Not enough seats available')) {
        this.notificationService.error('Cannot complete booking: not enough seats available for this screening.');
      } else {
        this.notificationService.error(msg);
      }
    } finally {
      this.isPaying.set(false);
    }
  }

  downloadBillPdf(): void {
    const doc = new jsPDF();

    const title = 'CineVault - Bill';
    doc.setFontSize(16);
    doc.text(title, 14, 18);

    doc.setFontSize(10);
    doc.text(`Customer: ${this.customerLabel()}`, 14, 28);
    doc.text(`Date: ${this.billDate()}`, 14, 34);

    let y = 46;
    doc.setFontSize(12);
    doc.text('Booking Summary', 14, y);
    y += 8;

    doc.setFontSize(10);
    const items = this.payMode() ? this.payItems() : this.items();

    if (items.length === 0) {
      doc.text('No items in cart.', 14, y);
      y += 8;
    } else {
      doc.text('Movie', 14, y);
      doc.text('Screening', 80, y);
      doc.text('Seats', 130, y);
      doc.text('Price', 170, y, { align: 'right' });
      y += 6;
      doc.line(14, y, 196, y);
      y += 6;

      for (const item of items) {
        const screening = item.screenings?.().find((s: Screening) => s.id === item.selectedScreeningId?.());
        const screeningLabel = screening
          ? `${new Date(screening.startsAt).toLocaleString()} – ${screening.room}`
          : '—';
        const seats = item.seatsCount?.() ?? 1;
        const price = this.getMoviePrice(item.movie) * seats;
        const titleLine = this.truncate(item.movie.title, 30);
        const screeningLine = this.truncate(screeningLabel, 30);
        doc.text(titleLine, 14, y);
        doc.text(screeningLine, 80, y);
        doc.text(seats.toString(), 130, y, { align: 'center' });
        doc.text(price.toFixed(2), 170, y, { align: 'right' });
        y += 6;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }

      y += 4;
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFontSize(12);
      if (this.payMode()) {
        doc.text(`Total Seats: ${this.totalSeats()}`, 14, y);
        y += 6;
        doc.text(`Total Price: ${this.totalPrice().toFixed(2)}`, 14, y);
      } else {
        doc.text('Total', 14, y);
        doc.text(this.totalAmount().toFixed(2), 170, y, { align: 'right' });
      }
    }

    doc.save(`cinevault-bill-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  private getMoviePrice(movie: unknown): number {
    const m = movie as { price?: unknown };
    const raw = m?.price;
    if (raw == null || raw === '') return 0;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : 0;
  }

  private truncate(value: string, max: number): string {
    if (value.length <= max) return value;
    return `${value.slice(0, Math.max(0, max - 3))}...`;
  }
}
