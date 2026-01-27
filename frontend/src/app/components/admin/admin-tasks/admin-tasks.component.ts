import { Component } from '@angular/core';
import { ManagerTasksComponent } from '../../manager/manager-tasks/manager-tasks.component';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [ManagerTasksComponent],
  template: `
    <h2 class="page-title">Tasks Management</h2>
    <app-manager-tasks></app-manager-tasks>
  `,
})
export class AdminTasksComponent {}
