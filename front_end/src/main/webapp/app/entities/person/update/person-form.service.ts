import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPerson, NewPerson } from '../person.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPerson for edit and NewPersonFormGroupInput for create.
 */
type PersonFormGroupInput = IPerson | PartialWithRequiredKeyOf<NewPerson>;

type PersonFormDefaults = Pick<NewPerson, 'id'>;

type PersonFormGroupContent = {
  id: FormControl<IPerson['id'] | NewPerson['id']>;
  nid: FormControl<IPerson['nid']>;
  docType: FormControl<IPerson['docType']>;
  firstName: FormControl<IPerson['firstName']>;
  lastName: FormControl<IPerson['lastName']>;
  gender: FormControl<IPerson['gender']>;
  birthDate: FormControl<IPerson['birthDate']>;
  birthAddress: FormControl<IPerson['birthAddress']>;
  status: FormControl<IPerson['status']>;
  birthLocation: FormControl<IPerson['birthLocation']>;
};

export type PersonFormGroup = FormGroup<PersonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonFormService {
  createPersonFormGroup(person: PersonFormGroupInput = { id: null }): PersonFormGroup {
    const personRawValue = {
      ...this.getFormDefaults(),
      ...person,
    };
    return new FormGroup<PersonFormGroupContent>({
      id: new FormControl(
        { value: personRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nid: new FormControl(personRawValue.nid, {
        validators: [Validators.required],
      }),
      docType: new FormControl(personRawValue.docType, {
        validators: [Validators.required],
      }),
      firstName: new FormControl(personRawValue.firstName),
      lastName: new FormControl(personRawValue.lastName),
      gender: new FormControl(personRawValue.gender, {
        validators: [Validators.required],
      }),
      birthDate: new FormControl(personRawValue.birthDate),
      birthAddress: new FormControl(personRawValue.birthAddress),
      status: new FormControl(personRawValue.status, {
        validators: [Validators.required],
      }),
      birthLocation: new FormControl(personRawValue.birthLocation),
    });
  }

  getPerson(form: PersonFormGroup): IPerson | NewPerson {
    return form.getRawValue() as IPerson | NewPerson;
  }

  resetForm(form: PersonFormGroup, person: PersonFormGroupInput): void {
    const personRawValue = { ...this.getFormDefaults(), ...person };
    form.reset(
      {
        ...personRawValue,
        id: { value: personRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PersonFormDefaults {
    return {
      id: null,
    };
  }
}
