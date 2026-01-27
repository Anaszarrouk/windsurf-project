import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-genres',
  standalone: true,
  template: `
    <h2 class="page-title">Genres Management</h2>
    <div class="card">
      <p>Create / Edit / Delete genres (admin-only)</p>
    </div>
  `,
})
export class AdminGenresComponent {}
