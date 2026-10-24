import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Supplier } from '../models/supplier';

const API_URL = 'http://127.0.0.1:3000/suppliers';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(API_URL);
  }

  update(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${API_URL}/${supplier.id}`, supplier);
  }
}
