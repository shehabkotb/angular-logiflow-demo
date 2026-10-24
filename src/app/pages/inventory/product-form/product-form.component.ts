import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '../../../models/product';
import { skuFormatValidator } from '../../../validators/sku.validator';

export type ProductFormValue = Omit<Product, 'id'>;

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;

  @Output() save = new EventEmitter<ProductFormValue>();
  // not 'cancel', that clashes with the native DOM event
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({
    sku: new FormControl('', { nonNullable: true, validators: [Validators.required, skuFormatValidator()] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    locations: new FormArray<FormControl<string>>([])
  });

  get sku() { return this.form.controls.sku; }
  get name() { return this.form.controls.name; }
  get category() { return this.form.controls.category; }
  get price() { return this.form.controls.price; }
  get stock() { return this.form.controls.stock; }
  get locations() { return this.form.controls.locations; }

  ngOnInit(): void {
    if (this.product) {
      this.form.patchValue(this.product);

      // patchValue can't resize a FormArray, rebuild it
      this.locations.clear();
      for (const location of this.product.locations) {
        this.addLocation(location);
      }
    } else {
      this.addLocation();
    }
  }

  addLocation(value = ''): void {
    this.locations.push(new FormControl(value, { nonNullable: true, validators: [Validators.required] }));
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      sku: value.sku,
      name: value.name,
      category: value.category,
      // form is valid so these aren't null
      price: value.price ?? 0,
      stock: value.stock ?? 0,
      locations: value.locations
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
