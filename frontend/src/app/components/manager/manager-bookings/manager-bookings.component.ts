import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  template: `
    <h2 class="page-title">Bookings</h2>
    <div class="card">
      <p>View bookings per screening, reschedule/cancel (manager/admin)</p>
    </div>
  `,
})
export class ManagerBookingsComponent {}
