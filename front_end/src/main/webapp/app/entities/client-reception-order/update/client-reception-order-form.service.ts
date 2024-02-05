import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IClientReceptionOrder, NewClientReceptionOrder } from '../client-reception-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClientReceptionOrder for edit and NewClientReceptionOrderFormGroupInput for create.
 */
type ClientReceptionOrderFormGroupInput = IClientReceptionOrder | PartialWithRequiredKeyOf<NewClientReceptionOrder>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IClientReceptionOrder | NewClientReceptionOrder> = Omit<T, 'receivedOn' | 'deliveryDate'> & {
  receivedOn?: string | null;
  deliveryDate?: string | null;
};

type ClientReceptionOrderFormRawValue = FormValueOf<IClientReceptionOrder>;

type NewClientReceptionOrderFormRawValue = FormValueOf<NewClientReceptionOrder>;

type ClientReceptionOrderFormDefaults = Pick<NewClientReceptionOrder, 'id' | 'receivedOn' | 'deliveryDate'>;

type ClientReceptionOrderFormGroupContent = {
  id: FormControl<ClientReceptionOrderFormRawValue['id'] | NewClientReceptionOrder['id']>;
  orderNumber: FormControl<ClientReceptionOrderFormRawValue['orderNumber']>;
  divisionId: FormControl<ClientReceptionOrderFormRawValue['divisionId']>;
  receivedOn: FormControl<ClientReceptionOrderFormRawValue['receivedOn']>;
  receptionMode: FormControl<ClientReceptionOrderFormRawValue['receptionMode']>;
  jobDescription: FormControl<ClientReceptionOrderFormRawValue['jobDescription']>;
  totalCost: FormControl<ClientReceptionOrderFormRawValue['totalCost']>;
  totalJobCards: FormControl<ClientReceptionOrderFormRawValue['totalJobCards']>;
  deliveryDate: FormControl<ClientReceptionOrderFormRawValue['deliveryDate']>;
  assignedToDivisionNames: FormControl<ClientReceptionOrderFormRawValue['assignedToDivisionNames']>;
  assignedToEmployeeNames: FormControl<ClientReceptionOrderFormRawValue['assignedToEmployeeNames']>;
  orderingStatus: FormControl<ClientReceptionOrderFormRawValue['orderingStatus']>;
  invoicingStatus: FormControl<ClientReceptionOrderFormRawValue['invoicingStatus']>;
  client: FormControl<ClientReceptionOrderFormRawValue['client']>;
  assignedToEmployee: FormControl<ClientReceptionOrderFormRawValue['assignedToEmployee']>;
};

export type ClientReceptionOrderFormGroup = FormGroup<ClientReceptionOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientReceptionOrderFormService {
  createClientReceptionOrderFormGroup(
    clientReceptionOrder: ClientReceptionOrderFormGroupInput = { id: null }
  ): ClientReceptionOrderFormGroup {
    const clientReceptionOrderRawValue = this.convertClientReceptionOrderToClientReceptionOrderRawValue({
      ...this.getFormDefaults(),
      ...clientReceptionOrder,
    });
    return new FormGroup<ClientReceptionOrderFormGroupContent>({
      id: new FormControl(
        { value: clientReceptionOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      orderNumber: new FormControl(clientReceptionOrderRawValue.orderNumber, {
        validators: [Validators.required],
      }),
      divisionId: new FormControl(clientReceptionOrderRawValue.divisionId, {
        validators: [Validators.required],
      }),
      receivedOn: new FormControl(clientReceptionOrderRawValue.receivedOn),
      receptionMode: new FormControl(clientReceptionOrderRawValue.receptionMode, {
        validators: [Validators.required],
      }),
      jobDescription: new FormControl(clientReceptionOrderRawValue.jobDescription),
      totalCost: new FormControl(clientReceptionOrderRawValue.totalCost),
      totalJobCards: new FormControl(clientReceptionOrderRawValue.totalJobCards),
      deliveryDate: new FormControl(clientReceptionOrderRawValue.deliveryDate),
      assignedToDivisionNames: new FormControl(clientReceptionOrderRawValue.assignedToDivisionNames, {
        validators: [Validators.required],
      }),
      assignedToEmployeeNames: new FormControl(clientReceptionOrderRawValue.assignedToEmployeeNames, {
        validators: [Validators.required],
      }),
      orderingStatus: new FormControl(clientReceptionOrderRawValue.orderingStatus, {
        validators: [Validators.required],
      }),
      invoicingStatus: new FormControl(clientReceptionOrderRawValue.invoicingStatus, {
        validators: [Validators.required],
      }),
      client: new FormControl(clientReceptionOrderRawValue.client),
      assignedToEmployee: new FormControl(clientReceptionOrderRawValue.assignedToEmployee),
    });
  }

  getClientReceptionOrder(form: ClientReceptionOrderFormGroup): IClientReceptionOrder | NewClientReceptionOrder {
    return this.convertClientReceptionOrderRawValueToClientReceptionOrder(
      form.getRawValue() as ClientReceptionOrderFormRawValue | NewClientReceptionOrderFormRawValue
    );
  }

  resetForm(form: ClientReceptionOrderFormGroup, clientReceptionOrder: ClientReceptionOrderFormGroupInput): void {
    const clientReceptionOrderRawValue = this.convertClientReceptionOrderToClientReceptionOrderRawValue({
      ...this.getFormDefaults(),
      ...clientReceptionOrder,
    });
    form.reset(
      {
        ...clientReceptionOrderRawValue,
        id: { value: clientReceptionOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClientReceptionOrderFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      receivedOn: currentTime,
      deliveryDate: currentTime,
    };
  }

  private convertClientReceptionOrderRawValueToClientReceptionOrder(
    rawClientReceptionOrder: ClientReceptionOrderFormRawValue | NewClientReceptionOrderFormRawValue
  ): IClientReceptionOrder | NewClientReceptionOrder {
    return {
      ...rawClientReceptionOrder,
      receivedOn: dayjs(rawClientReceptionOrder.receivedOn, DATE_TIME_FORMAT),
      deliveryDate: dayjs(rawClientReceptionOrder.deliveryDate, DATE_TIME_FORMAT),
    };
  }

  private convertClientReceptionOrderToClientReceptionOrderRawValue(
    clientReceptionOrder: IClientReceptionOrder | (Partial<NewClientReceptionOrder> & ClientReceptionOrderFormDefaults)
  ): ClientReceptionOrderFormRawValue | PartialWithRequiredKeyOf<NewClientReceptionOrderFormRawValue> {
    return {
      ...clientReceptionOrder,
      receivedOn: clientReceptionOrder.receivedOn ? clientReceptionOrder.receivedOn.format(DATE_TIME_FORMAT) : undefined,
      deliveryDate: clientReceptionOrder.deliveryDate ? clientReceptionOrder.deliveryDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
