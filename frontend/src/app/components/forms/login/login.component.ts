import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RainbowDirective } from '../../../directives/rainbow.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RainbowDirective],
  template: `
    <div class="login-container">
      <div class="login-card card">
        <h2>Login to CineVault</h2>
        <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              [(ngModel)]="credentials.username"
              required
              minlength="3"
              #username="ngModel"
              [class.error]="username.invalid && username.touched"
              appRainbow>
            @if (username.invalid && username.touched) {
              <span class="error-message">Username is required (min 3 chars)</span>
            }
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password"
              required
              minlength="6"
              #password="ngModel"
              [class.error]="password.invalid && password.touched">
            @if (password.invalid && password.touched) {
              <span class="error-message">Password is required (min 6 chars)</span>
            }
          </div>
          @if (errorMessage) {
            <div class="error-message">{{ errorMessage }}</div>
          }
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <div style="margin-top: 12px; text-align: center;">
            <a routerLink="/register">No account? Register</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      padding: 40px 0;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    .login-card h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #e50914;
    }
    button {
      width: 100%;
      margin-top: 10px;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
