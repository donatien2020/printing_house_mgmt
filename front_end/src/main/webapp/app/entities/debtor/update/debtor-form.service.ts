import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDebtor, NewDebtor } from '../debtor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDebtor for edit and NewDebtorFormGroupInput for create.
 */
type DebtorFormGroupInput = IDebtor | PartialWithRequiredKeyOf<NewDebtor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDebtor | NewDebtor> = Omit<T, 'debtDate'> & {
  debtDate?: string | null;
};

type DebtorFormRawValue = FormValueOf<IDebtor>;

type NewDebtorFormRawValue = FormValueOf<NewDebtor>;

type DebtorFormDefaults = Pick<NewDebtor, 'id' | 'debtDate'>;

type DebtorFormGroupContent = {
  id: FormControl<DebtorFormRawValue['id'] | NewDebtor['id']>;
  serviceDescription: FormControl<DebtorFormRawValue['serviceDescription']>;
  productDescription: FormControl<DebtorFormRawValue['productDescription']>;
  debtDate: FormControl<DebtorFormRawValue['debtDate']>;
  debtStatus: FormControl<DebtorFormRawValue['debtStatus']>;
  invoicingStatus: FormControl<DebtorFormRawValue['invoicingStatus']>;
  totalAmount: FormControl<DebtorFormRawValue['totalAmount']>;
  paidAmount: FormControl<DebtorFormRawValue['paidAmount']>;
  supplier: FormControl<DebtorFormRawValue['supplier']>;
};

export type DebtorFormGroup = FormGroup<DebtorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DebtorFormService {
  createDebtorFormGroup(debtor: DebtorFormGroupInput = { id: null }): DebtorFormGroup {
    const debtorRawValue = this.convertDebtorToDebtorRawValue({
      ...this.getFormDefaults(),
      ...debtor,
    });
    return new FormGroup<DebtorFormGroupContent>({
      id: new FormControl(
        { value: debtorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      serviceDescription: new FormControl(debtorRawValue.serviceDescription),
      productDescription: new FormControl(debtorRawValue.productDescription),
      debtDate: new FormControl(debtorRawValue.debtDate),
      debtStatus: new FormControl(debtorRawValue.debtStatus, {
        validators: [Validators.required],
      }),
      invoicingStatus: new FormControl(debtorRawValue.invoicingStatus, {
        validators: [Validators.required],
      }),
      totalAmount: new FormControl(debtorRawValue.totalAmount),
      paidAmount: new FormControl(debtorRawValue.paidAmount),
      supplier: new FormControl(debtorRawValue.supplier),
    });
  }

  getDebtor(form: DebtorFormGroup): IDebtor | NewDebtor {
    return this.convertDebtorRawValueToDebtor(form.getRawValue() as DebtorFormRawValue | NewDebtorFormRawValue);
  }

  resetForm(form: DebtorFormGroup, debtor: DebtorFormGroupInput): void {
    const debtorRawValue = this.convertDebtorToDebtorRawValue({ ...this.getFormDefaults(), ...debtor });
    form.reset(
      {
        ...debtorRawValue,
        id: { value: debtorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DebtorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      debtDate: currentTime,
    };
  }

  private convertDebtorRawValueToDebtor(rawDebtor: DebtorFormRawValue | NewDebtorFormRawValue): IDebtor | NewDebtor {
    return {
      ...rawDebtor,
      debtDate: dayjs(rawDebtor.debtDate, DATE_TIME_FORMAT),
    };
  }

  private convertDebtorToDebtorRawValue(
    debtor: IDebtor | (Partial<NewDebtor> & DebtorFormDefaults)
  ): DebtorFormRawValue | PartialWithRequiredKeyOf<NewDebtorFormRawValue> {
    return {
      ...debtor,
      debtDate: debtor.debtDate ? debtor.debtDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
