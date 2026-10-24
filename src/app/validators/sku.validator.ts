import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// INV- followed by 4 letters/digits, e.g. INV-A104
const SKU_PATTERN = /^INV-[A-Za-z0-9]{4}$/;

// empty is handled by Validators.required
export function skuFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';
    if (value === '') {
      return null;
    }
    return SKU_PATTERN.test(value) ? null : { skuFormat: true };
  };
}
