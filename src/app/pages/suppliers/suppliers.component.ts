import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';
import { CardComponent } from '../../shared/card/card.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { SupplierFormComponent, SupplierFormValue } from './supplier-form/supplier-form.component';

@Component({
  selector: 'app-suppliers',
  imports: [CardComponent, ModalComponent, SupplierFormComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit, OnDestroy {
  private supplierService = inject(SupplierService);
  private notification = inject(NotificationService);

  suppliers = signal<Supplier[]>([]);
  loading = signal(true);
  error = signal(false);

  editingSupplier: Supplier | null = null;

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.supplierService.getAll().subscribe({
      next: suppliers => {
        this.suppliers.set(suppliers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openEditForm(supplier: Supplier): void {
    this.editingSupplier = supplier;
  }

  closeForm(): void {
    this.editingSupplier = null;
  }

  onSave(value: SupplierFormValue): void {
    if (!this.editingSupplier) {
      return;
    }

    const changed: Supplier = { ...this.editingSupplier, ...value };

    this.supplierService.update(changed).subscribe({
      next: updated => {
        this.suppliers.update(list => list.map(s => (s.id === updated.id ? updated : s)));
        this.closeForm();
        this.notification.show('Supplier updated successfully');
      },
      error: () => this.notification.show('Could not save the supplier. Is the API running?')
    });
  }
}
