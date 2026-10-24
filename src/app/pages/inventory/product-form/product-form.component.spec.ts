import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent, ProductFormValue } from './product-form.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  // add mode starts with one empty location
  function fillValidForm(): void {
    component.form.patchValue({
      sku: 'INV-A104',
      name: 'Pallet Jack',
      category: 'Equipment',
      price: 300,
      stock: 5
    });
    component.locations.at(0).setValue('Aisle 3');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invalid when the form is empty', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.sku.hasError('required')).toBeTrue();
    expect(component.name.hasError('required')).toBeTrue();
  });

  it('should show a skuFormat error for a SKU like "ABC-1"', () => {
    component.sku.setValue('ABC-1');

    expect(component.sku.hasError('skuFormat')).toBeTrue();
  });

  it('should accept a SKU like "INV-A104"', () => {
    component.sku.setValue('INV-A104');

    expect(component.sku.hasError('skuFormat')).toBeFalse();
    expect(component.sku.valid).toBeTrue();
  });

  it('should show minlength and min errors for a short name and negative numbers', () => {
    component.name.setValue('ab');
    component.price.setValue(-1);
    component.stock.setValue(-5);

    expect(component.name.hasError('minlength')).toBeTrue();
    expect(component.price.hasError('min')).toBeTrue();
    expect(component.stock.hasError('min')).toBeTrue();
  });

  it('should emit "save" with the form values when a valid form is submitted', () => {
    spyOn(component.save, 'emit');
    fillValidForm();

    component.onSubmit();

    const expected: ProductFormValue = {
      sku: 'INV-A104',
      name: 'Pallet Jack',
      category: 'Equipment',
      price: 300,
      stock: 5,
      locations: ['Aisle 3']
    };
    expect(component.save.emit).toHaveBeenCalledOnceWith(expected);
  });
});
