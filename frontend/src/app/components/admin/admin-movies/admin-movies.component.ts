import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  template: `
    <h2 class="page-title">Movies Management</h2>
    <div class="card">
      <p>Add / Edit / Delete movies (admin-only)</p>
    </div>
  `,
})
export class AdminMoviesComponent {}
