import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="add-movie-container">
      <div class="add-movie-card card">
        <h2>Add New Movie</h2>
        <form #movieForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" [(ngModel)]="movie.title" required #title="ngModel">
          </div>
          <div class="form-group">
            <label for="director">Director</label>
            <input type="text" id="director" name="director" [(ngModel)]="movie.director" required>
          </div>
          <div class="form-group">
            <label for="duration">Duration (minutes)</label>
            <input type="number" id="duration" name="duration" [(ngModel)]="movie.duration" required min="1">
          </div>
          <div class="form-group">
            <label for="poster">Poster URL</label>
            <input type="text" id="poster" name="poster" [(ngModel)]="movie.poster">
          </div>
          <div class="actions">
            <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="movieForm.invalid">Add Movie</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-movie-container { display: flex; justify-content: center; padding: 40px 0; }
    .add-movie-card { width: 100%; max-width: 500px; }
    .add-movie-card h2 { text-align: center; margin-bottom: 30px; color: #e50914; }
    .actions { display: flex; gap: 15px; margin-top: 20px; }
    .actions button { flex: 1; }
  `]
})
export class AddMovieComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);

  movie = { title: '', director: '', duration: 0, poster: '' };

  onSubmit(): void {
    this.movieService.createMovie(this.movie).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: (err) => console.error('Error creating movie:', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/movies']);
  }
}
