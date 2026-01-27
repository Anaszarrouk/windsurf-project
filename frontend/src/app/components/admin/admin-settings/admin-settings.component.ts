import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: `
    <h2 class="page-title">Settings</h2>
    <div class="card">
      <p>Cinema info, currency, tax, cancellation rules (admin-only)</p>
    </div>
  `,
})
export class AdminSettingsComponent {}
