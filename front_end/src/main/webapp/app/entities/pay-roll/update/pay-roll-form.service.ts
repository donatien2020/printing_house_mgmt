import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPayRoll, NewPayRoll } from '../pay-roll.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPayRoll for edit and NewPayRollFormGroupInput for create.
 */
type PayRollFormGroupInput = IPayRoll | PartialWithRequiredKeyOf<NewPayRoll>;

type PayRollFormDefaults = Pick<NewPayRoll, 'id'>;

type PayRollFormGroupContent = {
  id: FormControl<IPayRoll['id'] | NewPayRoll['id']>;
  organizationId: FormControl<IPayRoll['organizationId']>;
  payFrom: FormControl<IPayRoll['payFrom']>;
  payTo: FormControl<IPayRoll['payTo']>;
  status: FormControl<IPayRoll['status']>;
  totalGrossAmount: FormControl<IPayRoll['totalGrossAmount']>;
  totalNetAmount: FormControl<IPayRoll['totalNetAmount']>;
};

export type PayRollFormGroup = FormGroup<PayRollFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PayRollFormService {
  createPayRollFormGroup(payRoll: PayRollFormGroupInput = { id: null }): PayRollFormGroup {
    const payRollRawValue = {
      ...this.getFormDefaults(),
      ...payRoll,
    };
    return new FormGroup<PayRollFormGroupContent>({
      id: new FormControl(
        { value: payRollRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      organizationId: new FormControl(payRollRawValue.organizationId, {
        validators: [Validators.required],
      }),
      payFrom: new FormControl(payRollRawValue.payFrom, {
        validators: [Validators.required],
      }),
      payTo: new FormControl(payRollRawValue.payTo, {
        validators: [Validators.required],
      }),
      status: new FormControl(payRollRawValue.status, {
        validators: [Validators.required],
      }),
      totalGrossAmount: new FormControl(payRollRawValue.totalGrossAmount, {
        validators: [Validators.required],
      }),
      totalNetAmount: new FormControl(payRollRawValue.totalNetAmount, {
        validators: [Validators.required],
      }),
    });
  }

  getPayRoll(form: PayRollFormGroup): IPayRoll | NewPayRoll {
    return form.getRawValue() as IPayRoll | NewPayRoll;
  }

  resetForm(form: PayRollFormGroup, payRoll: PayRollFormGroupInput): void {
    const payRollRawValue = { ...this.getFormDefaults(), ...payRoll };
    form.reset(
      {
        ...payRollRawValue,
        id: { value: payRollRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PayRollFormDefaults {
    return {
      id: null,
    };
  }
}
