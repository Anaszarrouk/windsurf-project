import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allow = () => {
    const role = (authService.currentUser()?.role ?? '').toLowerCase();
    return role === 'manager' || role === 'admin';
  };
  if (authService.isAuthenticated() && allow()) {
    return true;
  }

  return authService.refreshSession$().pipe(
    map(() => {
      if (allow()) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    }),
  );
};
