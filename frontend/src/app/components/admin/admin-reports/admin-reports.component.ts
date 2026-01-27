import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  template: `
    <h2 class="page-title">Reports & Analytics</h2>
    <div class="card">
      <p>Revenue/day/movie/genre, export CSV/PDF (admin-only)</p>
    </div>
  `,
})
export class AdminReportsComponent {}
