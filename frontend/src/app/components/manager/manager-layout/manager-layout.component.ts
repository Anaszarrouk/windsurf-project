import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar card">
        <h3>Manager Panel</h3>
        <nav>
          <a routerLink="/manager" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/manager/screenings" routerLinkActive="active">Today’s Screenings</a>
          <a routerLink="/manager/tasks" routerLinkActive="active">Tasks</a>
          <a routerLink="/manager/bookings" routerLinkActive="active">Bookings</a>
          <a routerLink="/manager/user-reports" routerLinkActive="active">User Reports</a>
          <a routerLink="/manager/reports" routerLinkActive="active">Reports</a>
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
export class ManagerLayoutComponent {}
