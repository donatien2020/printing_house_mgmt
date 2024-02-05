import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReceipt, NewReceipt } from '../receipt.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReceipt for edit and NewReceiptFormGroupInput for create.
 */
type ReceiptFormGroupInput = IReceipt | PartialWithRequiredKeyOf<NewReceipt>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReceipt | NewReceipt> = Omit<T, 'paymentDate'> & {
  paymentDate?: string | null;
};

type ReceiptFormRawValue = FormValueOf<IReceipt>;

type NewReceiptFormRawValue = FormValueOf<NewReceipt>;

type ReceiptFormDefaults = Pick<NewReceipt, 'id' | 'paymentDate'>;

type ReceiptFormGroupContent = {
  id: FormControl<ReceiptFormRawValue['id'] | NewReceipt['id']>;
  invoiceId: FormControl<ReceiptFormRawValue['invoiceId']>;
  totalCost: FormControl<ReceiptFormRawValue['totalCost']>;
  totalPaid: FormControl<ReceiptFormRawValue['totalPaid']>;
  balance: FormControl<ReceiptFormRawValue['balance']>;
  paymentDate: FormControl<ReceiptFormRawValue['paymentDate']>;
  receivedByNames: FormControl<ReceiptFormRawValue['receivedByNames']>;
};

export type ReceiptFormGroup = FormGroup<ReceiptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReceiptFormService {
  createReceiptFormGroup(receipt: ReceiptFormGroupInput = { id: null }): ReceiptFormGroup {
    const receiptRawValue = this.convertReceiptToReceiptRawValue({
      ...this.getFormDefaults(),
      ...receipt,
    });
    return new FormGroup<ReceiptFormGroupContent>({
      id: new FormControl(
        { value: receiptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      invoiceId: new FormControl(receiptRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      totalCost: new FormControl(receiptRawValue.totalCost, {
        validators: [Validators.required],
      }),
      totalPaid: new FormControl(receiptRawValue.totalPaid, {
        validators: [Validators.required],
      }),
      balance: new FormControl(receiptRawValue.balance, {
        validators: [Validators.required],
      }),
      paymentDate: new FormControl(receiptRawValue.paymentDate, {
        validators: [Validators.required],
      }),
      receivedByNames: new FormControl(receiptRawValue.receivedByNames, {
        validators: [Validators.required],
      }),
    });
  }

  getReceipt(form: ReceiptFormGroup): IReceipt | NewReceipt {
    return this.convertReceiptRawValueToReceipt(form.getRawValue() as ReceiptFormRawValue | NewReceiptFormRawValue);
  }

  resetForm(form: ReceiptFormGroup, receipt: ReceiptFormGroupInput): void {
    const receiptRawValue = this.convertReceiptToReceiptRawValue({ ...this.getFormDefaults(), ...receipt });
    form.reset(
      {
        ...receiptRawValue,
        id: { value: receiptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReceiptFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      paymentDate: currentTime,
    };
  }

  private convertReceiptRawValueToReceipt(rawReceipt: ReceiptFormRawValue | NewReceiptFormRawValue): IReceipt | NewReceipt {
    return {
      ...rawReceipt,
      paymentDate: dayjs(rawReceipt.paymentDate, DATE_TIME_FORMAT),
    };
  }

  private convertReceiptToReceiptRawValue(
    receipt: IReceipt | (Partial<NewReceipt> & ReceiptFormDefaults)
  ): ReceiptFormRawValue | PartialWithRequiredKeyOf<NewReceiptFormRawValue> {
    return {
      ...receipt,
      paymentDate: receipt.paymentDate ? receipt.paymentDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
