import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Supplier } from '../../../models/supplier';

export type SupplierFormValue = Pick<Supplier, 'contactName' | 'email' | 'phone'>;

@Component({
  selector: 'app-supplier-form',
  imports: [ReactiveFormsModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {
  @Input() supplier: Supplier | null = null;

  @Output() save = new EventEmitter<SupplierFormValue>();
  // not 'cancel', that clashes with the native DOM event
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({
    contactName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  get contactName() { return this.form.controls.contactName; }
  get email() { return this.form.controls.email; }
  get phone() { return this.form.controls.phone; }

  ngOnInit(): void {
    if (this.supplier) {
      this.form.patchValue(this.supplier);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
