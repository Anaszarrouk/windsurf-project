import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-screenings',
  standalone: true,
  template: `
    <h2 class="page-title">Today’s Screenings</h2>
    <div class="card">
      <p>Start/End screening, occupancy, issues reporting (manager/admin)</p>
    </div>
  `,
})
export class ManagerScreeningsComponent {}
