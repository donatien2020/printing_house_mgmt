import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IContract, NewContract } from '../contract.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContract for edit and NewContractFormGroupInput for create.
 */
type ContractFormGroupInput = IContract | PartialWithRequiredKeyOf<NewContract>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IContract | NewContract> = Omit<T, 'validFrom' | 'validTo'> & {
  validFrom?: string | null;
  validTo?: string | null;
};

type ContractFormRawValue = FormValueOf<IContract>;

type NewContractFormRawValue = FormValueOf<NewContract>;

type ContractFormDefaults = Pick<NewContract, 'id' | 'validFrom' | 'validTo'>;

type ContractFormGroupContent = {
  id: FormControl<ContractFormRawValue['id'] | NewContract['id']>;
  contractType: FormControl<ContractFormRawValue['contractType']>;
  contractNumber: FormControl<ContractFormRawValue['contractNumber']>;
  description: FormControl<ContractFormRawValue['description']>;
  validFrom: FormControl<ContractFormRawValue['validFrom']>;
  validTo: FormControl<ContractFormRawValue['validTo']>;
  status: FormControl<ContractFormRawValue['status']>;
  currentAttachmentId: FormControl<ContractFormRawValue['currentAttachmentId']>;
  ownerId: FormControl<ContractFormRawValue['ownerId']>;
  ownerType: FormControl<ContractFormRawValue['ownerType']>;
  acquiringStatus: FormControl<ContractFormRawValue['acquiringStatus']>;
};

export type ContractFormGroup = FormGroup<ContractFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContractFormService {
  createContractFormGroup(contract: ContractFormGroupInput = { id: null }): ContractFormGroup {
    const contractRawValue = this.convertContractToContractRawValue({
      ...this.getFormDefaults(),
      ...contract,
    });
    return new FormGroup<ContractFormGroupContent>({
      id: new FormControl(
        { value: contractRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      contractType: new FormControl(contractRawValue.contractType, {
        validators: [Validators.required],
      }),
      contractNumber: new FormControl(contractRawValue.contractNumber, {
        validators: [Validators.required],
      }),
      description: new FormControl(contractRawValue.description),
      validFrom: new FormControl(contractRawValue.validFrom),
      validTo: new FormControl(contractRawValue.validTo),
      status: new FormControl(contractRawValue.status, {
        validators: [Validators.required],
      }),
      currentAttachmentId: new FormControl(contractRawValue.currentAttachmentId),
      ownerId: new FormControl(contractRawValue.ownerId, {
        validators: [Validators.required],
      }),
      ownerType: new FormControl(contractRawValue.ownerType, {
        validators: [Validators.required],
      }),
      acquiringStatus: new FormControl(contractRawValue.acquiringStatus, {
        validators: [Validators.required],
      }),
    });
  }

  getContract(form: ContractFormGroup): IContract | NewContract {
    return this.convertContractRawValueToContract(form.getRawValue() as ContractFormRawValue | NewContractFormRawValue);
  }

  resetForm(form: ContractFormGroup, contract: ContractFormGroupInput): void {
    const contractRawValue = this.convertContractToContractRawValue({ ...this.getFormDefaults(), ...contract });
    form.reset(
      {
        ...contractRawValue,
        id: { value: contractRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContractFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      validFrom: currentTime,
      validTo: currentTime,
    };
  }

  private convertContractRawValueToContract(rawContract: ContractFormRawValue | NewContractFormRawValue): IContract | NewContract {
    return {
      ...rawContract,
      validFrom: dayjs(rawContract.validFrom, DATE_TIME_FORMAT),
      validTo: dayjs(rawContract.validTo, DATE_TIME_FORMAT),
    };
  }

  private convertContractToContractRawValue(
    contract: IContract | (Partial<NewContract> & ContractFormDefaults)
  ): ContractFormRawValue | PartialWithRequiredKeyOf<NewContractFormRawValue> {
    return {
      ...contract,
      validFrom: contract.validFrom ? contract.validFrom.format(DATE_TIME_FORMAT) : undefined,
      validTo: contract.validTo ? contract.validTo.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
