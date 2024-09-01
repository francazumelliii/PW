import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return isNaN(value) ? { 'notANumber': true } : null;
  };
}
