import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { managerGuard } from './guards/manager.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'movies',
        loadComponent: () => import('./components/admin/admin-movies/admin-movies.component').then(m => m.AdminMoviesComponent),
      },
      {
        path: 'genres',
        loadComponent: () => import('./components/admin/admin-genres/admin-genres.component').then(m => m.AdminGenresComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
      },
      {
        path: 'screenings',
        loadComponent: () => import('./components/admin/admin-screenings/admin-screenings.component').then(m => m.AdminScreeningsComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./components/admin/admin-tasks/admin-tasks.component').then(m => m.AdminTasksComponent),
      },
      {
        path: 'pricing',
        loadComponent: () => import('./components/admin/admin-pricing/admin-pricing.component').then(m => m.AdminPricingComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/admin/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
      },
    ],
  },
  {
    path: 'manager',
    canActivate: [managerGuard],
    loadComponent: () => import('./components/manager/manager-layout/manager-layout.component').then(m => m.ManagerLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/manager/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
      },
      {
        path: 'screenings',
        loadComponent: () => import('./components/manager/manager-screenings/manager-screenings.component').then(m => m.ManagerScreeningsComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./components/manager/manager-tasks/manager-tasks.component').then(m => m.ManagerTasksComponent),
      },
      {
        path: 'bookings',
        loadComponent: () => import('./components/manager/manager-bookings/manager-bookings.component').then(m => m.ManagerBookingsComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/manager/manager-reports/manager-reports.component').then(m => m.ManagerReportsComponent),
      },
    ],
  },
  {
    path: 'movies',
    loadComponent: () => import('./components/cinetech/movie/movie.component').then(m => m.MovieComponent),
    canActivate: [authGuard],
  },
  {
    path: 'movies/add',
    loadComponent: () => import('./components/forms/add-movie/add-movie.component').then(m => m.AddMovieComponent),
    canActivate: [authGuard],
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./components/cinetech/detail/detail.component').then(m => m.DetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'genres',
    loadComponent: () => import('./components/signals/genre-list/genre-list.component').then(m => m.GenreListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/forms/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/forms/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
