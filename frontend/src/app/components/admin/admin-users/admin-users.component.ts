import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <h2 class="page-title">Users Management</h2>
    <div class="card">
      <p>View users, assign roles, ban/unban, reset password (admin-only)</p>
    </div>
  `,
})
export class AdminUsersComponent {}
