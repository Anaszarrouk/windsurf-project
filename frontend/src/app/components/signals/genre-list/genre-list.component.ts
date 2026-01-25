import { Component, signal } from '@angular/core';

// Exercise 5.2: GenreListComponent using @for with @empty block and @if for long names
@Component({
  selector: 'app-genre-list',
  standalone: true,
  template: `
    <div class="genre-list-container">
      <h2 class="page-title">Movie Genres</h2>
      <div class="genre-grid">
        @for (genre of genres(); track genre) {
          <div class="genre-card card">
            <span class="genre-name">{{ genre }}</span>
            @if (genre.length > 10) {
              <span class="long-genre-icon" title="Long genre name">📝</span>
            }
          </div>
        } @empty {
          <div class="no-genres card">
            <p>No genres available</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .genre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .genre-card { display: flex; justify-content: space-between; align-items: center; }
    .genre-name { font-weight: 500; }
    .long-genre-icon { font-size: 18px; }
    .no-genres { text-align: center; color: #999; grid-column: 1 / -1; }
  `]
})
export class GenreListComponent {
  genres = signal<string[]>([
    'Action',
    'Science Fiction',
    'Drama',
    'Comedy',
    'Horror',
    'Romance',
    'Thriller',
    'Animation',
    'Documentary',
    'Adventure',
    'Mystery Suspense',
    'Fantasy Epic'
  ]);
}
