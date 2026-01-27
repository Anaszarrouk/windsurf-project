import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <h1>Welcome to CineVault</h1>
      <p>Your ultimate movie theater management system</p>
      <div class="hero-actions">
        <a routerLink="/movies" class="btn btn-primary">Browse Movies</a>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card card">
        <h3>Movie Management</h3>
        <p>Browse, add, and manage your movie collection with ease.</p>
      </div>
      <div class="feature-card card">
        <h3>Reviews & Ratings</h3>
        <p>Rate movies, write reviews, and see the community feedback.</p>
      </div>
      <div class="feature-card card">
        <h3>Theater Tasks</h3>
        <p>Track and manage screening tasks efficiently.</p>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 12px;
      margin-bottom: 40px;
    }
    .hero h1 {
      font-size: 48px;
      margin-bottom: 10px;
      color: #e50914;
    }
    .hero p {
      font-size: 18px;
      color: #999;
      margin-bottom: 30px;
    }
    .hero-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .feature-card {
      text-align: center;
    }
    .feature-card h3 {
      color: #e50914;
      margin-bottom: 10px;
    }
    .feature-card p {
      color: #999;
    }
    @media (max-width: 768px) {
      .features {
        grid-template-columns: 1fr;
      }
      .hero h1 {
        font-size: 32px;
      }
    }
  `]
})
export class HomeComponent {}
