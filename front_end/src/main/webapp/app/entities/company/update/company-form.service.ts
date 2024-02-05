import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompany, NewCompany } from '../company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompany for edit and NewCompanyFormGroupInput for create.
 */
type CompanyFormGroupInput = ICompany | PartialWithRequiredKeyOf<NewCompany>;

type CompanyFormDefaults = Pick<NewCompany, 'id'>;

type CompanyFormGroupContent = {
  id: FormControl<ICompany['id'] | NewCompany['id']>;
  companyNames: FormControl<ICompany['companyNames']>;
  tinNumber: FormControl<ICompany['tinNumber']>;
  description: FormControl<ICompany['description']>;
  status: FormControl<ICompany['status']>;
};

export type CompanyFormGroup = FormGroup<CompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyFormService {
  createCompanyFormGroup(company: CompanyFormGroupInput = { id: null }): CompanyFormGroup {
    const companyRawValue = {
      ...this.getFormDefaults(),
      ...company,
    };
    return new FormGroup<CompanyFormGroupContent>({
      id: new FormControl(
        { value: companyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      companyNames: new FormControl(companyRawValue.companyNames, {
        validators: [Validators.required],
      }),
      tinNumber: new FormControl(companyRawValue.tinNumber, {
        validators: [Validators.required],
      }),
      description: new FormControl(companyRawValue.description),
      status: new FormControl(companyRawValue.status),
    });
  }

  getCompany(form: CompanyFormGroup): ICompany | NewCompany {
    return form.getRawValue() as ICompany | NewCompany;
  }

  resetForm(form: CompanyFormGroup, company: CompanyFormGroupInput): void {
    const companyRawValue = { ...this.getFormDefaults(), ...company };
    form.reset(
      {
        ...companyRawValue,
        id: { value: companyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompanyFormDefaults {
    return {
      id: null,
    };
  }
}
