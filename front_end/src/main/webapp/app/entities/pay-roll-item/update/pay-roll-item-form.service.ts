import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPayRollItem, NewPayRollItem } from '../pay-roll-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPayRollItem for edit and NewPayRollItemFormGroupInput for create.
 */
type PayRollItemFormGroupInput = IPayRollItem | PartialWithRequiredKeyOf<NewPayRollItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPayRollItem | NewPayRollItem> = Omit<T, 'collectionDate' | 'computationDate'> & {
  collectionDate?: string | null;
  computationDate?: string | null;
};

type PayRollItemFormRawValue = FormValueOf<IPayRollItem>;

type NewPayRollItemFormRawValue = FormValueOf<NewPayRollItem>;

type PayRollItemFormDefaults = Pick<NewPayRollItem, 'id' | 'collectionDate' | 'computationDate'>;

type PayRollItemFormGroupContent = {
  id: FormControl<PayRollItemFormRawValue['id'] | NewPayRollItem['id']>;
  divisionId: FormControl<PayRollItemFormRawValue['divisionId']>;
  empId: FormControl<PayRollItemFormRawValue['empId']>;
  empNumber: FormControl<PayRollItemFormRawValue['empNumber']>;
  netAmount: FormControl<PayRollItemFormRawValue['netAmount']>;
  grossAmount: FormControl<PayRollItemFormRawValue['grossAmount']>;
  collectionStatus: FormControl<PayRollItemFormRawValue['collectionStatus']>;
  collectionDate: FormControl<PayRollItemFormRawValue['collectionDate']>;
  computationDate: FormControl<PayRollItemFormRawValue['computationDate']>;
  payRoll: FormControl<PayRollItemFormRawValue['payRoll']>;
};

export type PayRollItemFormGroup = FormGroup<PayRollItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PayRollItemFormService {
  createPayRollItemFormGroup(payRollItem: PayRollItemFormGroupInput = { id: null }): PayRollItemFormGroup {
    const payRollItemRawValue = this.convertPayRollItemToPayRollItemRawValue({
      ...this.getFormDefaults(),
      ...payRollItem,
    });
    return new FormGroup<PayRollItemFormGroupContent>({
      id: new FormControl(
        { value: payRollItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      divisionId: new FormControl(payRollItemRawValue.divisionId, {
        validators: [Validators.required],
      }),
      empId: new FormControl(payRollItemRawValue.empId, {
        validators: [Validators.required],
      }),
      empNumber: new FormControl(payRollItemRawValue.empNumber, {
        validators: [Validators.required],
      }),
      netAmount: new FormControl(payRollItemRawValue.netAmount, {
        validators: [Validators.required],
      }),
      grossAmount: new FormControl(payRollItemRawValue.grossAmount, {
        validators: [Validators.required],
      }),
      collectionStatus: new FormControl(payRollItemRawValue.collectionStatus, {
        validators: [Validators.required],
      }),
      collectionDate: new FormControl(payRollItemRawValue.collectionDate, {
        validators: [Validators.required],
      }),
      computationDate: new FormControl(payRollItemRawValue.computationDate, {
        validators: [Validators.required],
      }),
      payRoll: new FormControl(payRollItemRawValue.payRoll),
    });
  }

  getPayRollItem(form: PayRollItemFormGroup): IPayRollItem | NewPayRollItem {
    return this.convertPayRollItemRawValueToPayRollItem(form.getRawValue() as PayRollItemFormRawValue | NewPayRollItemFormRawValue);
  }

  resetForm(form: PayRollItemFormGroup, payRollItem: PayRollItemFormGroupInput): void {
    const payRollItemRawValue = this.convertPayRollItemToPayRollItemRawValue({ ...this.getFormDefaults(), ...payRollItem });
    form.reset(
      {
        ...payRollItemRawValue,
        id: { value: payRollItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PayRollItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      collectionDate: currentTime,
      computationDate: currentTime,
    };
  }

  private convertPayRollItemRawValueToPayRollItem(
    rawPayRollItem: PayRollItemFormRawValue | NewPayRollItemFormRawValue
  ): IPayRollItem | NewPayRollItem {
    return {
      ...rawPayRollItem,
      collectionDate: dayjs(rawPayRollItem.collectionDate, DATE_TIME_FORMAT),
      computationDate: dayjs(rawPayRollItem.computationDate, DATE_TIME_FORMAT),
    };
  }

  private convertPayRollItemToPayRollItemRawValue(
    payRollItem: IPayRollItem | (Partial<NewPayRollItem> & PayRollItemFormDefaults)
  ): PayRollItemFormRawValue | PartialWithRequiredKeyOf<NewPayRollItemFormRawValue> {
    return {
      ...payRollItem,
      collectionDate: payRollItem.collectionDate ? payRollItem.collectionDate.format(DATE_TIME_FORMAT) : undefined,
      computationDate: payRollItem.computationDate ? payRollItem.computationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
