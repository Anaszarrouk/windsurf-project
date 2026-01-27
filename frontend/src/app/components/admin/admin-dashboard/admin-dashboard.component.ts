import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <h1 class="page-title">Admin Dashboard</h1>
    <div class="grid">
      <div class="card"><h3>Total Movies</h3><p>—</p></div>
      <div class="card"><h3>Today’s Screenings</h3><p>—</p></div>
      <div class="card"><h3>Tickets Sold Today</h3><p>—</p></div>
      <div class="card"><h3>Revenue Today</h3><p>—</p></div>
    </div>
    <div class="card" style="margin-top: 20px;">
      <h3>Alerts</h3>
      <p>Low seat availability, maintenance pending, low bookings…</p>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminDashboardComponent {}
