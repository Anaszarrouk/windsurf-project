import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <a routerLink="/" class="btn btn-primary">Go Home</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 80px 20px;
    }
    .not-found h1 {
      font-size: 120px;
      color: #e50914;
      margin: 0;
    }
    .not-found h2 {
      font-size: 32px;
      margin: 10px 0;
    }
    .not-found p {
      color: #999;
      margin-bottom: 30px;
    }
  `]
})
export class NotFoundComponent {}
