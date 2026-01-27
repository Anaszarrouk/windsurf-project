import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  template: `
    <h1 class="page-title">Manager Dashboard</h1>
    <div class="card">
      <p>Today’s screenings timeline, occupancy, tasks pending, quick actions…</p>
    </div>
  `,
})
export class ManagerDashboardComponent {}
