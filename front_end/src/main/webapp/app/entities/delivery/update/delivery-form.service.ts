import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDelivery, NewDelivery } from '../delivery.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDelivery for edit and NewDeliveryFormGroupInput for create.
 */
type DeliveryFormGroupInput = IDelivery | PartialWithRequiredKeyOf<NewDelivery>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDelivery | NewDelivery> = Omit<T, 'deliveryDate'> & {
  deliveryDate?: string | null;
};

type DeliveryFormRawValue = FormValueOf<IDelivery>;

type NewDeliveryFormRawValue = FormValueOf<NewDelivery>;

type DeliveryFormDefaults = Pick<NewDelivery, 'id' | 'deliveryDate'>;

type DeliveryFormGroupContent = {
  id: FormControl<DeliveryFormRawValue['id'] | NewDelivery['id']>;
  receiptionOrder: FormControl<DeliveryFormRawValue['receiptionOrder']>;
  orderNumber: FormControl<DeliveryFormRawValue['orderNumber']>;
  delivererId: FormControl<DeliveryFormRawValue['delivererId']>;
  deliveryNote: FormControl<DeliveryFormRawValue['deliveryNote']>;
  receiverClientId: FormControl<DeliveryFormRawValue['receiverClientId']>;
  document: FormControl<DeliveryFormRawValue['document']>;
  deliveryDate: FormControl<DeliveryFormRawValue['deliveryDate']>;
  deliveryAddress: FormControl<DeliveryFormRawValue['deliveryAddress']>;
  location: FormControl<DeliveryFormRawValue['location']>;
  status: FormControl<DeliveryFormRawValue['status']>;
};

export type DeliveryFormGroup = FormGroup<DeliveryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DeliveryFormService {
  createDeliveryFormGroup(delivery: DeliveryFormGroupInput = { id: null }): DeliveryFormGroup {
    const deliveryRawValue = this.convertDeliveryToDeliveryRawValue({
      ...this.getFormDefaults(),
      ...delivery,
    });
    return new FormGroup<DeliveryFormGroupContent>({
      id: new FormControl(
        { value: deliveryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      receiptionOrder: new FormControl(deliveryRawValue.receiptionOrder, {
        validators: [Validators.required],
      }),
      orderNumber: new FormControl(deliveryRawValue.orderNumber, {
        validators: [Validators.required],
      }),
      delivererId: new FormControl(deliveryRawValue.delivererId, {
        validators: [Validators.required],
      }),
      deliveryNote: new FormControl(deliveryRawValue.deliveryNote),
      receiverClientId: new FormControl(deliveryRawValue.receiverClientId, {
        validators: [Validators.required],
      }),
      document: new FormControl(deliveryRawValue.document),
      deliveryDate: new FormControl(deliveryRawValue.deliveryDate),
      deliveryAddress: new FormControl(deliveryRawValue.deliveryAddress),
      location: new FormControl(deliveryRawValue.location),
      status: new FormControl(deliveryRawValue.status, {
        validators: [Validators.required],
      }),
    });
  }

  getDelivery(form: DeliveryFormGroup): IDelivery | NewDelivery {
    return this.convertDeliveryRawValueToDelivery(form.getRawValue() as DeliveryFormRawValue | NewDeliveryFormRawValue);
  }

  resetForm(form: DeliveryFormGroup, delivery: DeliveryFormGroupInput): void {
    const deliveryRawValue = this.convertDeliveryToDeliveryRawValue({ ...this.getFormDefaults(), ...delivery });
    form.reset(
      {
        ...deliveryRawValue,
        id: { value: deliveryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DeliveryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      deliveryDate: currentTime,
    };
  }

  private convertDeliveryRawValueToDelivery(rawDelivery: DeliveryFormRawValue | NewDeliveryFormRawValue): IDelivery | NewDelivery {
    return {
      ...rawDelivery,
      deliveryDate: dayjs(rawDelivery.deliveryDate, DATE_TIME_FORMAT),
    };
  }

  private convertDeliveryToDeliveryRawValue(
    delivery: IDelivery | (Partial<NewDelivery> & DeliveryFormDefaults)
  ): DeliveryFormRawValue | PartialWithRequiredKeyOf<NewDeliveryFormRawValue> {
    return {
      ...delivery,
      deliveryDate: delivery.deliveryDate ? delivery.deliveryDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
