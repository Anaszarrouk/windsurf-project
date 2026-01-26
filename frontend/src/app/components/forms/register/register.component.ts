import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RainbowDirective } from '../../../directives/rainbow.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, RainbowDirective],
  template: `
    <div class="login-container">
      <div class="login-card card">
        <h2>Create your account</h2>
        <form #registerForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="form.username"
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
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="form.email"
              required
              #email="ngModel"
              [class.error]="email.invalid && email.touched">
            @if (email.invalid && email.touched) {
              <span class="error-message">A valid email is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="form.password"
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
            [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating account...' : 'Register' }}
          </button>

          <div style="margin-top: 12px; text-align: center;">
            <a routerLink="/login">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    button {
      width: 100%;
      margin-top: 10px;
    }
  `],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = { username: '', email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.form.username, this.form.email, this.form.password).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
