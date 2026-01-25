import { Injectable, signal, computed } from '@angular/core';
import { Movie } from './movie.service';

// Exercise 10.1: BookingCartService (EmbaucheService) to manage selected movies
@Injectable({
  providedIn: 'root'
})
export class BookingCartService {
  private cartItems = signal<Movie[]>([]);

  items = this.cartItems.asReadonly();
  
  itemCount = computed(() => this.cartItems().length);
  
  isEmpty = computed(() => this.cartItems().length === 0);

  addToCart(movie: Movie): void {
    const currentItems = this.cartItems();
    if (!currentItems.find(m => m.id === movie.id)) {
      this.cartItems.set([...currentItems, movie]);
    }
  }

  removeFromCart(movieId: string): void {
    this.cartItems.update(items => items.filter(m => m.id !== movieId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  isInCart(movieId: string): boolean {
    return this.cartItems().some(m => m.id === movieId);
  }
}
