import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { Product } from '../../models/product';
import { InventoryService, SortBy, StockFilter } from '../../services/inventory.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { StockHighlightDirective } from '../../shared/stock-highlight.directive';
import { ProductFormComponent, ProductFormValue } from './product-form/product-form.component';

@Component({
  selector: 'app-inventory',
  imports: [CurrencyPipe, ReactiveFormsModule, StockHighlightDirective, ModalComponent, ProductFormComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventory = inject(InventoryService);
  private notification = inject(NotificationService);

  searchControl = new FormControl('', { nonNullable: true });

  private searchSubscription?: Subscription;

  formOpen = false;
  editingProduct: Product | null = null;

  productToDelete: Product | null = null;

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

  openAddForm(): void {
    this.editingProduct = null;
    this.formOpen = true;
  }

  openEditForm(product: Product): void {
    this.editingProduct = product;
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.editingProduct = null;
  }

  onSave(value: ProductFormValue): void {
    if (this.editingProduct) {
      const updated: Product = { ...value, id: this.editingProduct.id };
      this.inventory.updateProduct(updated).subscribe(() => {
        this.closeForm();
        this.notification.show('Stock updated successfully');
      });
    } else {
      this.inventory.addProduct(value).subscribe(() => {
        this.closeForm();
        this.notification.show('Product added successfully');
      });
    }
  }

  askToDelete(product: Product): void {
    this.productToDelete = product;
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

  confirmDelete(): void {
    const product = this.productToDelete;
    if (!product) {
      return;
    }
    this.inventory.deleteProduct(product.id).subscribe(() => {
      this.productToDelete = null;
      this.notification.show(`${product.name} deleted`);
    });
  }
}
