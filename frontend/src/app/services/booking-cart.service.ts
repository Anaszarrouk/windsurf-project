import { Injectable, signal, computed, effect } from '@angular/core';
import { Movie } from './movie.service';

// Exercise 10.1: BookingCartService (EmbaucheService) to manage selected movies
@Injectable({
  providedIn: 'root'
})
export class BookingCartService {
  private readonly storageKey = 'cinevault_cart_items';

  private cartItems = signal<Movie[]>([]);

  items = this.cartItems.asReadonly();
  
  itemCount = computed(() => this.cartItems().length);
  
  isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    this.restoreFromStorage();

    effect(() => {
      const items = this.cartItems();
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      } catch {
        // ignore storage errors
      }
    });
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const items = parsed.filter((m: any) => m && typeof m.id === 'string');
      this.cartItems.set(items);
    } catch {
      // ignore parse/storage errors
    }
  }

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
