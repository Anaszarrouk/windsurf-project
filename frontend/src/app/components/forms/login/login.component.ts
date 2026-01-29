import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
              >
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
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  credentials = { username: '', password: '' };
  isLoading = false;

  onSubmit(): void {
    this.isLoading = true;

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        const role = (this.authService.currentUser()?.role ?? '').toLowerCase();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
          return;
        }
        if (role === 'manager') {
          this.router.navigate(['/manager']);
          return;
        }

        this.router.navigate(['/movies']);
      },
      error: (err) => {
        const status: number | undefined = err?.status;
        const message =
          status === 401 || status === 403 ? 'Incorrect username or password.' :
          status === 0 ? 'Cannot reach the server. Please check your connection and try again.' :
          'Login failed. Please try again.';

        this.notificationService.error(message);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
