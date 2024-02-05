import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPOrganization, NewPOrganization } from '../p-organization.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPOrganization for edit and NewPOrganizationFormGroupInput for create.
 */
type POrganizationFormGroupInput = IPOrganization | PartialWithRequiredKeyOf<NewPOrganization>;

type POrganizationFormDefaults = Pick<NewPOrganization, 'id'>;

type POrganizationFormGroupContent = {
  id: FormControl<IPOrganization['id'] | NewPOrganization['id']>;
  officeAddress: FormControl<IPOrganization['officeAddress']>;
  description: FormControl<IPOrganization['description']>;
  profileID: FormControl<IPOrganization['profileID']>;
  companyType: FormControl<IPOrganization['companyType']>;
  status: FormControl<IPOrganization['status']>;
  company: FormControl<IPOrganization['company']>;
  officeLocation: FormControl<IPOrganization['officeLocation']>;
  parent: FormControl<IPOrganization['parent']>;
};

export type POrganizationFormGroup = FormGroup<POrganizationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class POrganizationFormService {
  createPOrganizationFormGroup(pOrganization: POrganizationFormGroupInput = { id: null }): POrganizationFormGroup {
    const pOrganizationRawValue = {
      ...this.getFormDefaults(),
      ...pOrganization,
    };
    return new FormGroup<POrganizationFormGroupContent>({
      id: new FormControl(
        { value: pOrganizationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      officeAddress: new FormControl(pOrganizationRawValue.officeAddress, {
        validators: [Validators.required],
      }),
      description: new FormControl(pOrganizationRawValue.description, {
        validators: [Validators.required],
      }),
      profileID: new FormControl(pOrganizationRawValue.profileID),
      companyType: new FormControl(pOrganizationRawValue.companyType, {
        validators: [Validators.required],
      }),
      status: new FormControl(pOrganizationRawValue.status, {
        validators: [Validators.required],
      }),
      company: new FormControl(pOrganizationRawValue.company),
      officeLocation: new FormControl(pOrganizationRawValue.officeLocation),
      parent: new FormControl(pOrganizationRawValue.parent),
    });
  }

  getPOrganization(form: POrganizationFormGroup): IPOrganization | NewPOrganization {
    return form.getRawValue() as IPOrganization | NewPOrganization;
  }

  resetForm(form: POrganizationFormGroup, pOrganization: POrganizationFormGroupInput): void {
    const pOrganizationRawValue = { ...this.getFormDefaults(), ...pOrganization };
    form.reset(
      {
        ...pOrganizationRawValue,
        id: { value: pOrganizationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): POrganizationFormDefaults {
    return {
      id: null,
    };
  }
}
