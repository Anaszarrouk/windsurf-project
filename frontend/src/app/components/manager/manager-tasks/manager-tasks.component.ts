import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-tasks',
  standalone: true,
  template: `
    <h2 class="page-title">Tasks</h2>
    <div class="card">
      <p>Manage screening tasks (pending/in progress/completed) (manager/admin)</p>
    </div>
  `,
})
export class ManagerTasksComponent {}
