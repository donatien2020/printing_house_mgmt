import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClient, NewClient } from '../client.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClient for edit and NewClientFormGroupInput for create.
 */
type ClientFormGroupInput = IClient | PartialWithRequiredKeyOf<NewClient>;

type ClientFormDefaults = Pick<NewClient, 'id'>;

type ClientFormGroupContent = {
  id: FormControl<IClient['id'] | NewClient['id']>;
  clientType: FormControl<IClient['clientType']>;
  engagementMode: FormControl<IClient['engagementMode']>;
  address: FormControl<IClient['address']>;
  currentContractId: FormControl<IClient['currentContractId']>;
  contactPhoneNumber: FormControl<IClient['contactPhoneNumber']>;
  organizationId: FormControl<IClient['organizationId']>;
  person: FormControl<IClient['person']>;
  company: FormControl<IClient['company']>;
  residenceLocation: FormControl<IClient['residenceLocation']>;
};

export type ClientFormGroup = FormGroup<ClientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientFormService {
  createClientFormGroup(client: ClientFormGroupInput = { id: null }): ClientFormGroup {
    const clientRawValue = {
      ...this.getFormDefaults(),
      ...client,
    };
    return new FormGroup<ClientFormGroupContent>({
      id: new FormControl(
        { value: clientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      clientType: new FormControl(clientRawValue.clientType, {
        validators: [Validators.required],
      }),
      engagementMode: new FormControl(clientRawValue.engagementMode, {
        validators: [Validators.required],
      }),
      address: new FormControl(clientRawValue.address),
      currentContractId: new FormControl(clientRawValue.currentContractId),
      contactPhoneNumber: new FormControl(clientRawValue.contactPhoneNumber),
      organizationId: new FormControl(clientRawValue.organizationId, {
        validators: [Validators.required],
      }),
      person: new FormControl(clientRawValue.person),
      company: new FormControl(clientRawValue.company),
      residenceLocation: new FormControl(clientRawValue.residenceLocation),
    });
  }

  getClient(form: ClientFormGroup): IClient | NewClient {
    return form.getRawValue() as IClient | NewClient;
  }

  resetForm(form: ClientFormGroup, client: ClientFormGroupInput): void {
    const clientRawValue = { ...this.getFormDefaults(), ...client };
    form.reset(
      {
        ...clientRawValue,
        id: { value: clientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClientFormDefaults {
    return {
      id: null,
    };
  }
}
