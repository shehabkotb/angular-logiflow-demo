import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Shipment, ShipmentStatus } from '../../models/shipment';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-shipments',
  imports: [DatePipe],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss'
})
export class ShipmentsComponent implements OnInit, OnDestroy {
  private shipmentService = inject(ShipmentService);

  shipments = signal<Shipment[]>([]);
  loading = signal(true);
  error = signal(false);

  statuses: ShipmentStatus[] = ['Pending', 'In Transit', 'Delivered', 'Delayed'];

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.shipmentService.getAll().subscribe({
      next: shipments => {
        this.shipments.set(shipments);
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

  countByStatus(status: ShipmentStatus): number {
    return this.shipments().filter(s => s.status === status).length;
  }
}
