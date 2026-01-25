import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
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
    path: 'calculator',
    loadComponent: () => import('./components/signals/ticket-price-engine/ticket-price-engine.component').then(m => m.TicketPriceEngineComponent),
  },
  {
    path: 'genres',
    loadComponent: () => import('./components/signals/genre-list/genre-list.component').then(m => m.GenreListComponent),
  },
  {
    path: 'word',
    loadComponent: () => import('./components/word/word.component').then(m => m.WordComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/forms/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
