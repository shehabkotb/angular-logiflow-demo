import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { InventoryService } from './inventory.service';
import { Product } from '../models/product';

const API_URL = 'http://127.0.0.1:3000/products';

// stock: 5 = critical, 20 = low, 100 = fine
const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, sku: 'INV-A001', name: 'Shelf', category: 'Storage', price: 50, stock: 100, locations: ['A1'] },
  { id: 2, sku: 'INV-A002', name: 'Box', category: 'Packaging', price: 2, stock: 20, locations: ['B1'] },
  { id: 3, sku: 'INV-A003', name: 'Forklift', category: 'Equipment', price: 1000, stock: 5, locations: ['C1'] }
];

describe('InventoryService', () => {
  let service: InventoryService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    // sort order is persisted, reset it between tests
    localStorage.removeItem('logiflow_sort');

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(InventoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.removeItem('logiflow_sort');
  });

  it('should calculate the total value as price x stock of all products', () => {
    service.products.set(SAMPLE_PRODUCTS);

    // 50 * 100 + 2 * 20 + 1000 * 5
    expect(service.totalValue()).toBe(10040);
  });

  it('should count products with a stock of 25 or less as low stock', () => {
    service.products.set(SAMPLE_PRODUCTS);

    expect(service.lowStockCount()).toBe(2);
  });

  it('should show only critical products (stock below 10) with the "critical" filter', () => {
    service.products.set(SAMPLE_PRODUCTS);

    service.stockFilter.set('critical');

    const names = service.visibleProducts().map(p => p.name);
    expect(names).toEqual(['Forklift']);
  });

  it('should sort by price, cheapest first', () => {
    service.products.set(SAMPLE_PRODUCTS);

    service.sortBy.set('price');

    const prices = service.visibleProducts().map(p => p.price);
    expect(prices).toEqual([2, 50, 1000]);
  });

  it('should load the products with a GET request and store them', () => {
    service.loadProducts();

    const request = httpTesting.expectOne(API_URL);
    expect(request.request.method).toBe('GET');

    request.flush(SAMPLE_PRODUCTS);

    expect(service.products()).toEqual(SAMPLE_PRODUCTS);
  });
});
