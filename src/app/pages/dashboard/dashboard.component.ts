import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { CardComponent } from '../../shared/card/card.component';
import { CRITICAL_STOCK, InventoryService } from '../../services/inventory.service';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, CurrencyPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  inventory = inject(InventoryService);
  private shipmentService = inject(ShipmentService);

  activeShipments = signal(0);
  shipmentsError = signal(false);

  criticalProducts = computed(() =>
    this.inventory.products().filter(p => p.stock < CRITICAL_STOCK)
  );

  private subscription?: Subscription;

  ngOnInit(): void {
    this.inventory.loadProducts();

    this.subscription = this.shipmentService.getAll().subscribe({
      next: shipments => {
        const active = shipments.filter(s => s.status !== 'Delivered');
        this.activeShipments.set(active.length);
      },
      error: () => this.shipmentsError.set(true)
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
