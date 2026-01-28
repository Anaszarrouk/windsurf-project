import { Component } from '@angular/core';
import { ManagerBookingsComponent } from '../../manager/manager-bookings/manager-bookings.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [ManagerBookingsComponent],
  template: `
    <h2 class="page-title">Bookings</h2>
    <app-manager-bookings></app-manager-bookings>
  `,
})
export class AdminBookingsComponent {}
