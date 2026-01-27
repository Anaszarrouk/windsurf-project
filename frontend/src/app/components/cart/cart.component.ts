import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { AuthService } from '../../services/auth.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe],
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
              <button type="button" class="btn btn-primary" (click)="downloadBillPdf()">Download bill (PDF)</button>
            </div>
          </div>

          <div class="card">
            <h2 style="margin-bottom: 15px;">Summary</h2>
            <div class="summary-row">
              <span>Customer</span>
              <span>{{ customerLabel() }}</span>
            </div>
            <div class="summary-row">
              <span>Date</span>
              <span>{{ billDate() }}</span>
            </div>
            <div class="summary-row">
              <span>Items</span>
              <span>{{ itemCount() }}</span>
            </div>
            <div class="summary-row">
              <span>Total</span>
              <span>{{ totalAmount() | number: '1.2-2' }}</span>
            </div>
          </div>
        </div>
      }
    </div>
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

  items = this.cart.items;
  itemCount = this.cart.itemCount;
  isEmpty = this.cart.isEmpty;

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

  remove(movieId: string): void {
    this.cart.removeFromCart(movieId);
  }

  clear(): void {
    this.cart.clearCart();
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
    doc.text('Items', 14, y);
    y += 8;

    doc.setFontSize(10);
    const items = this.items();

    if (items.length === 0) {
      doc.text('No items in cart.', 14, y);
      y += 8;
    } else {
      doc.text('Title', 14, y);
      doc.text('Price', 170, y, { align: 'right' });
      y += 6;
      doc.line(14, y, 196, y);
      y += 6;

      for (const m of items) {
        const price = this.getMoviePrice(m);
        const titleLine = this.truncate(m.title, 70);
        doc.text(titleLine, 14, y);
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
      doc.text('Total', 14, y);
      doc.text(this.totalAmount().toFixed(2), 170, y, { align: 'right' });
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
