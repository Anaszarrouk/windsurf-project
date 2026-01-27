import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <a routerLink="/" class="navbar-brand">CineVault</a>
        <ul class="navbar-nav">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li><a routerLink="/movies" routerLinkActive="active">Movies</a></li>
          <li><a routerLink="/calculator" routerLinkActive="active">Tickets</a></li>
          <li><a routerLink="/word" routerLinkActive="active">Word</a></li>
          @if (isAuthenticated()) {
            @if ((currentUser()?.role ?? '').toLowerCase() === 'admin') {
              <li><a routerLink="/admin" routerLinkActive="active">Admin</a></li>
              <li><a routerLink="/manager" routerLinkActive="active">Manager</a></li>
            } @else if ((currentUser()?.role ?? '').toLowerCase() === 'manager') {
              <li><a routerLink="/manager" routerLinkActive="active">Manager</a></li>
            }
          }
          @if (isAuthenticated()) {
            <li><button type="button" class="btn btn-secondary" (click)="onLogout()">Logout</button></li>
          } @else {
            <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
            <li><a routerLink="/register" routerLinkActive="active">Register</a></li>
          }
        </ul>
      </div>
    </nav>
    <main class="container" style="padding-top: 30px;">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'CineVault';

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
