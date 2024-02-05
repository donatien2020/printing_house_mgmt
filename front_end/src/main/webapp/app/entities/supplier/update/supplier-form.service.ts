import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISupplier, NewSupplier } from '../supplier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISupplier for edit and NewSupplierFormGroupInput for create.
 */
type SupplierFormGroupInput = ISupplier | PartialWithRequiredKeyOf<NewSupplier>;

type SupplierFormDefaults = Pick<NewSupplier, 'id'>;

type SupplierFormGroupContent = {
  id: FormControl<ISupplier['id'] | NewSupplier['id']>;
  address: FormControl<ISupplier['address']>;
  phoneNumber: FormControl<ISupplier['phoneNumber']>;
  description: FormControl<ISupplier['description']>;
  specialization: FormControl<ISupplier['specialization']>;
  status: FormControl<ISupplier['status']>;
  company: FormControl<ISupplier['company']>;
};

export type SupplierFormGroup = FormGroup<SupplierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupplierFormService {
  createSupplierFormGroup(supplier: SupplierFormGroupInput = { id: null }): SupplierFormGroup {
    const supplierRawValue = {
      ...this.getFormDefaults(),
      ...supplier,
    };
    return new FormGroup<SupplierFormGroupContent>({
      id: new FormControl(
        { value: supplierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      address: new FormControl(supplierRawValue.address, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(supplierRawValue.phoneNumber, {
        validators: [Validators.required],
      }),
      description: new FormControl(supplierRawValue.description, {
        validators: [Validators.required],
      }),
      specialization: new FormControl(supplierRawValue.specialization, {
        validators: [Validators.required],
      }),
      status: new FormControl(supplierRawValue.status, {
        validators: [Validators.required],
      }),
      company: new FormControl(supplierRawValue.company),
    });
  }

  getSupplier(form: SupplierFormGroup): ISupplier | NewSupplier {
    return form.getRawValue() as ISupplier | NewSupplier;
  }

  resetForm(form: SupplierFormGroup, supplier: SupplierFormGroupInput): void {
    const supplierRawValue = { ...this.getFormDefaults(), ...supplier };
    form.reset(
      {
        ...supplierRawValue,
        id: { value: supplierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SupplierFormDefaults {
    return {
      id: null,
    };
  }
}
