import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { InventoryService, SortBy, StockFilter } from '../../services/inventory.service';
import { StockHighlightDirective } from '../../shared/stock-highlight.directive';

@Component({
  selector: 'app-inventory',
  imports: [CurrencyPipe, ReactiveFormsModule, StockHighlightDirective],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventory = inject(InventoryService);

  searchControl = new FormControl('', { nonNullable: true });

  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.inventory.loadProducts();

    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        // switchMap cancels the previous request
        switchMap(term => this.inventory.searchProducts(term))
      )
      .subscribe(result => this.inventory.products.set(result));
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as StockFilter;
    this.inventory.stockFilter.set(value);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortBy;
    this.inventory.sortBy.set(value);
  }
}
