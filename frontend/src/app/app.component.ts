import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

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
          <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
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
  title = 'CineVault';
}
