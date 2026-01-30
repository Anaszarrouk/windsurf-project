import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-price-engine',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="calculator-container">
      <div class="calculator-card card">
        <h2>Ticket Price Calculator</h2>
        <div class="form-group">
          <label>Base Price ($)</label>
          <input type="number" [(ngModel)]="basePrice" (ngModelChange)="updateBasePrice($event)" min="0" step="0.5">
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" [(ngModel)]="qty" (ngModelChange)="updateQuantity($event)" min="1">
        </div>
        <div class="results card">
          <div class="result-item">
            <span>Subtotal:</span>
            <span>\${{ subtotal() | number:'1.2-2' }}</span>
          </div>
          @if (discount() > 0) {
            <div class="result-item discount">
              <span>Discount ({{ discountPercentage() }}%):</span>
              <span>-\${{ discount() | number:'1.2-2' }}</span>
            </div>
          }
          <div class="result-item total">
            <span>Total:</span>
            <span>\${{ total() | number:'1.2-2' }}</span>
          </div>
        </div>
        <div class="discount-info">
          <p>20% discount for more than 10 tickets</p>
          <p>30% discount for more than 15 tickets</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calculator-container { display: flex; justify-content: center; padding: 40px 0; }
    .calculator-card { width: 100%; max-width: 400px; }
    .calculator-card h2 { text-align: center; margin-bottom: 30px; color: #e50914; }
    .results { margin-top: 30px; background: #2a2a2a; }
    .result-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333; }
    .result-item:last-child { border-bottom: none; }
    .result-item.discount { color: #4caf50; }
    .result-item.total { font-size: 18px; font-weight: bold; color: #e50914; }
    .discount-info { margin-top: 20px; padding: 15px; background: #1a1a1a; border-radius: 4px; }
    .discount-info p { color: #999; font-size: 14px; margin: 5px 0; }
  `]
})
export class TicketPriceEngineComponent {
  basePrice = 12;
  qty = 1;

  private basePriceSignal = signal(12);
  private quantitySignal = signal(1);

  subtotal = computed(() => this.basePriceSignal() * this.quantitySignal());

  discountPercentage = computed(() => {
    const q = this.quantitySignal();
    if (q > 15) return 30;
    if (q > 10) return 20;
    return 0;
  });

  discount = computed(() => this.subtotal() * (this.discountPercentage() / 100));

  total = computed(() => this.subtotal() - this.discount());

  updateBasePrice(value: number): void {
    this.basePriceSignal.set(value || 0);
  }

  updateQuantity(value: number): void {
    this.quantitySignal.set(value || 1);
  }
}
