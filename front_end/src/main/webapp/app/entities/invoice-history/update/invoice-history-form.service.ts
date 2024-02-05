import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoiceHistory, NewInvoiceHistory } from '../invoice-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoiceHistory for edit and NewInvoiceHistoryFormGroupInput for create.
 */
type InvoiceHistoryFormGroupInput = IInvoiceHistory | PartialWithRequiredKeyOf<NewInvoiceHistory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoiceHistory | NewInvoiceHistory> = Omit<T, 'doneOn'> & {
  doneOn?: string | null;
};

type InvoiceHistoryFormRawValue = FormValueOf<IInvoiceHistory>;

type NewInvoiceHistoryFormRawValue = FormValueOf<NewInvoiceHistory>;

type InvoiceHistoryFormDefaults = Pick<NewInvoiceHistory, 'id' | 'doneOn'>;

type InvoiceHistoryFormGroupContent = {
  id: FormControl<InvoiceHistoryFormRawValue['id'] | NewInvoiceHistory['id']>;
  invoiceId: FormControl<InvoiceHistoryFormRawValue['invoiceId']>;
  action: FormControl<InvoiceHistoryFormRawValue['action']>;
  description: FormControl<InvoiceHistoryFormRawValue['description']>;
  doneOn: FormControl<InvoiceHistoryFormRawValue['doneOn']>;
};

export type InvoiceHistoryFormGroup = FormGroup<InvoiceHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceHistoryFormService {
  createInvoiceHistoryFormGroup(invoiceHistory: InvoiceHistoryFormGroupInput = { id: null }): InvoiceHistoryFormGroup {
    const invoiceHistoryRawValue = this.convertInvoiceHistoryToInvoiceHistoryRawValue({
      ...this.getFormDefaults(),
      ...invoiceHistory,
    });
    return new FormGroup<InvoiceHistoryFormGroupContent>({
      id: new FormControl(
        { value: invoiceHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      invoiceId: new FormControl(invoiceHistoryRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      action: new FormControl(invoiceHistoryRawValue.action, {
        validators: [Validators.required],
      }),
      description: new FormControl(invoiceHistoryRawValue.description, {
        validators: [Validators.required],
      }),
      doneOn: new FormControl(invoiceHistoryRawValue.doneOn, {
        validators: [Validators.required],
      }),
    });
  }

  getInvoiceHistory(form: InvoiceHistoryFormGroup): IInvoiceHistory | NewInvoiceHistory {
    return this.convertInvoiceHistoryRawValueToInvoiceHistory(
      form.getRawValue() as InvoiceHistoryFormRawValue | NewInvoiceHistoryFormRawValue
    );
  }

  resetForm(form: InvoiceHistoryFormGroup, invoiceHistory: InvoiceHistoryFormGroupInput): void {
    const invoiceHistoryRawValue = this.convertInvoiceHistoryToInvoiceHistoryRawValue({ ...this.getFormDefaults(), ...invoiceHistory });
    form.reset(
      {
        ...invoiceHistoryRawValue,
        id: { value: invoiceHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvoiceHistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      doneOn: currentTime,
    };
  }

  private convertInvoiceHistoryRawValueToInvoiceHistory(
    rawInvoiceHistory: InvoiceHistoryFormRawValue | NewInvoiceHistoryFormRawValue
  ): IInvoiceHistory | NewInvoiceHistory {
    return {
      ...rawInvoiceHistory,
      doneOn: dayjs(rawInvoiceHistory.doneOn, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceHistoryToInvoiceHistoryRawValue(
    invoiceHistory: IInvoiceHistory | (Partial<NewInvoiceHistory> & InvoiceHistoryFormDefaults)
  ): InvoiceHistoryFormRawValue | PartialWithRequiredKeyOf<NewInvoiceHistoryFormRawValue> {
    return {
      ...invoiceHistory,
      doneOn: invoiceHistory.doneOn ? invoiceHistory.doneOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
