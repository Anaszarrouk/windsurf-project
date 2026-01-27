import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar card">
        <h3>Admin Panel</h3>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/admin/movies" routerLinkActive="active">Movies</a>
          <a routerLink="/admin/genres" routerLinkActive="active">Genres</a>
          <a routerLink="/admin/users" routerLinkActive="active">Users</a>
          <a routerLink="/admin/screenings" routerLinkActive="active">Screenings</a>
          <a routerLink="/admin/tasks" routerLinkActive="active">Tasks</a>
          <a routerLink="/admin/pricing" routerLinkActive="active">Pricing & Discounts</a>
          <a routerLink="/admin/reports" routerLinkActive="active">Reports</a>
          <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
        </nav>
      </aside>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 20px;
    }
    .sidebar {
      padding: 16px;
      height: fit-content;
      position: sticky;
      top: 20px;
    }
    nav {
      display: grid;
      gap: 10px;
      margin-top: 10px;
    }
    a.active {
      font-weight: 700;
      color: #e50914;
    }
    .content {
      min-height: 400px;
    }
    @media (max-width: 900px) {
      .admin-layout {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
      }
    }
  `],
})
export class AdminLayoutComponent {}
