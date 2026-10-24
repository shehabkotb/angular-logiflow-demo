import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Shipment } from '../models/shipment';

const API_URL = 'http://127.0.0.1:3000/shipments';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private http = inject(HttpClient);

  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(API_URL);
  }
}
