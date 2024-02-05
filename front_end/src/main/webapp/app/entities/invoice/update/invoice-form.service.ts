import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoice, NewInvoice } from '../invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoice | NewInvoice> = Omit<T, 'invoicedOn' | 'dueOn'> & {
  invoicedOn?: string | null;
  dueOn?: string | null;
};

type InvoiceFormRawValue = FormValueOf<IInvoice>;

type NewInvoiceFormRawValue = FormValueOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'invoicedOn' | 'dueOn'>;

type InvoiceFormGroupContent = {
  id: FormControl<InvoiceFormRawValue['id'] | NewInvoice['id']>;
  invoiceNumber: FormControl<InvoiceFormRawValue['invoiceNumber']>;
  totalJobCards: FormControl<InvoiceFormRawValue['totalJobCards']>;
  totalCost: FormControl<InvoiceFormRawValue['totalCost']>;
  paymentMode: FormControl<InvoiceFormRawValue['paymentMode']>;
  paymentType: FormControl<InvoiceFormRawValue['paymentType']>;
  invoiceType: FormControl<InvoiceFormRawValue['invoiceType']>;
  status: FormControl<InvoiceFormRawValue['status']>;
  receptionOrderId: FormControl<InvoiceFormRawValue['receptionOrderId']>;
  invoicedOn: FormControl<InvoiceFormRawValue['invoicedOn']>;
  dueOn: FormControl<InvoiceFormRawValue['dueOn']>;
  fromOrganizationId: FormControl<InvoiceFormRawValue['fromOrganizationId']>;
  debtor: FormControl<InvoiceFormRawValue['debtor']>;
  invoiceToClient: FormControl<InvoiceFormRawValue['invoiceToClient']>;
  toOrganization: FormControl<InvoiceFormRawValue['toOrganization']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({
      ...this.getFormDefaults(),
      ...invoice,
    });
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      invoiceNumber: new FormControl(invoiceRawValue.invoiceNumber, {
        validators: [Validators.required],
      }),
      totalJobCards: new FormControl(invoiceRawValue.totalJobCards),
      totalCost: new FormControl(invoiceRawValue.totalCost, {
        validators: [Validators.required],
      }),
      paymentMode: new FormControl(invoiceRawValue.paymentMode, {
        validators: [Validators.required],
      }),
      paymentType: new FormControl(invoiceRawValue.paymentType, {
        validators: [Validators.required],
      }),
      invoiceType: new FormControl(invoiceRawValue.invoiceType, {
        validators: [Validators.required],
      }),
      status: new FormControl(invoiceRawValue.status, {
        validators: [Validators.required],
      }),
      receptionOrderId: new FormControl(invoiceRawValue.receptionOrderId, {
        validators: [Validators.required],
      }),
      invoicedOn: new FormControl(invoiceRawValue.invoicedOn),
      dueOn: new FormControl(invoiceRawValue.dueOn),
      fromOrganizationId: new FormControl(invoiceRawValue.fromOrganizationId, {
        validators: [Validators.required],
      }),
      debtor: new FormControl(invoiceRawValue.debtor),
      invoiceToClient: new FormControl(invoiceRawValue.invoiceToClient),
      toOrganization: new FormControl(invoiceRawValue.toOrganization),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return this.convertInvoiceRawValueToInvoice(form.getRawValue() as InvoiceFormRawValue | NewInvoiceFormRawValue);
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({ ...this.getFormDefaults(), ...invoice });
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      invoicedOn: currentTime,
      dueOn: currentTime,
    };
  }

  private convertInvoiceRawValueToInvoice(rawInvoice: InvoiceFormRawValue | NewInvoiceFormRawValue): IInvoice | NewInvoice {
    return {
      ...rawInvoice,
      invoicedOn: dayjs(rawInvoice.invoicedOn, DATE_TIME_FORMAT),
      dueOn: dayjs(rawInvoice.dueOn, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceToInvoiceRawValue(
    invoice: IInvoice | (Partial<NewInvoice> & InvoiceFormDefaults)
  ): InvoiceFormRawValue | PartialWithRequiredKeyOf<NewInvoiceFormRawValue> {
    return {
      ...invoice,
      invoicedOn: invoice.invoicedOn ? invoice.invoicedOn.format(DATE_TIME_FORMAT) : undefined,
      dueOn: invoice.dueOn ? invoice.dueOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
