import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Product } from '../models/product';

const API_URL = 'http://127.0.0.1:3000/products';

const SORT_KEY = 'logiflow_sort';

export const CRITICAL_STOCK = 10; // below 10
export const LOW_STOCK = 25; // 25 or less

export type StockFilter = 'all' | 'low' | 'critical';
export type SortBy = 'name' | 'price' | 'stock';

function loadSavedSort(): SortBy {
  const saved = localStorage.getItem(SORT_KEY);
  if (saved === 'price' || saved === 'stock') {
    return saved;
  }
  return 'name';
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);

  products = signal<Product[]>([]);

  stockFilter = signal<StockFilter>('all');

  sortBy = signal<SortBy>(loadSavedSort());

  activity = signal<string[]>([]);

  visibleProducts = computed(() => {
    const filter = this.stockFilter();
    const sortBy = this.sortBy();

    const filtered = this.products().filter(p => {
      if (filter === 'critical') {
        return p.stock < CRITICAL_STOCK;
      }
      if (filter === 'low') {
        return p.stock <= LOW_STOCK;
      }
      return true;
    });

    // copy first, sort() mutates
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a[sortBy] - b[sortBy];
    });
  });

  totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.price * p.stock, 0)
  );

  lowStockCount = computed(
    () => this.products().filter(p => p.stock <= LOW_STOCK).length
  );

  recentActivity = computed(() => this.activity().slice(0, 5));

  constructor() {
    // persist sort order
    effect(() => {
      localStorage.setItem(SORT_KEY, this.sortBy());
    });
  }

  loadProducts(): void {
    this.http.get<Product[]>(API_URL).subscribe(products => {
      this.products.set(products);
    });
  }

  // json-server full-text search
  searchProducts(term: string): Observable<Product[]> {
    const search = term.trim();
    if (search === '') {
      return this.http.get<Product[]>(API_URL);
    }
    return this.http.get<Product[]>(API_URL, { params: { q: search } });
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(API_URL, product).pipe(
      tap(created => {
        this.products.update(list => [...list, created]);
        this.logActivity(`Added ${created.sku} ${created.name}`);
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${API_URL}/${product.id}`, product).pipe(
      tap(updated => {
        this.products.update(list =>
          list.map(p => (p.id === updated.id ? updated : p))
        );
        this.logActivity(`Updated ${updated.sku} ${updated.name}`);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      tap(() => {
        // grab it before removing so we can log the name
        const deleted = this.products().find(p => p.id === id);
        this.products.update(list => list.filter(p => p.id !== id));
        if (deleted) {
          this.logActivity(`Deleted ${deleted.sku} ${deleted.name}`);
        } else {
          this.logActivity(`Deleted product #${id}`);
        }
      })
    );
  }

  private logActivity(message: string): void {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    this.activity.update(list => [`${time} - ${message}`, ...list]);
  }
}
