import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  template: `
    <h2 class="page-title">Pricing & Discounts</h2>
    <div class="card">
      <p>Configure ticket pricing rules and promotions (admin-only)</p>
    </div>
  `,
})
export class AdminPricingComponent {}
