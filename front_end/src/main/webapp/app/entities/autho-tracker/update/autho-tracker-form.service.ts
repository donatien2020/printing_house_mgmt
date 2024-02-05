import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAuthoTracker, NewAuthoTracker } from '../autho-tracker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthoTracker for edit and NewAuthoTrackerFormGroupInput for create.
 */
type AuthoTrackerFormGroupInput = IAuthoTracker | PartialWithRequiredKeyOf<NewAuthoTracker>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAuthoTracker | NewAuthoTracker> = Omit<T, 'logedInOn'> & {
  logedInOn?: string | null;
};

type AuthoTrackerFormRawValue = FormValueOf<IAuthoTracker>;

type NewAuthoTrackerFormRawValue = FormValueOf<NewAuthoTracker>;

type AuthoTrackerFormDefaults = Pick<NewAuthoTracker, 'id' | 'logedInOn'>;

type AuthoTrackerFormGroupContent = {
  id: FormControl<AuthoTrackerFormRawValue['id'] | NewAuthoTracker['id']>;
  username: FormControl<AuthoTrackerFormRawValue['username']>;
  token: FormControl<AuthoTrackerFormRawValue['token']>;
  status: FormControl<AuthoTrackerFormRawValue['status']>;
  logedInOn: FormControl<AuthoTrackerFormRawValue['logedInOn']>;
};

export type AuthoTrackerFormGroup = FormGroup<AuthoTrackerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthoTrackerFormService {
  createAuthoTrackerFormGroup(authoTracker: AuthoTrackerFormGroupInput = { id: null }): AuthoTrackerFormGroup {
    const authoTrackerRawValue = this.convertAuthoTrackerToAuthoTrackerRawValue({
      ...this.getFormDefaults(),
      ...authoTracker,
    });
    return new FormGroup<AuthoTrackerFormGroupContent>({
      id: new FormControl(
        { value: authoTrackerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(authoTrackerRawValue.username),
      token: new FormControl(authoTrackerRawValue.token),
      status: new FormControl(authoTrackerRawValue.status),
      logedInOn: new FormControl(authoTrackerRawValue.logedInOn),
    });
  }

  getAuthoTracker(form: AuthoTrackerFormGroup): IAuthoTracker | NewAuthoTracker {
    return this.convertAuthoTrackerRawValueToAuthoTracker(form.getRawValue() as AuthoTrackerFormRawValue | NewAuthoTrackerFormRawValue);
  }

  resetForm(form: AuthoTrackerFormGroup, authoTracker: AuthoTrackerFormGroupInput): void {
    const authoTrackerRawValue = this.convertAuthoTrackerToAuthoTrackerRawValue({ ...this.getFormDefaults(), ...authoTracker });
    form.reset(
      {
        ...authoTrackerRawValue,
        id: { value: authoTrackerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AuthoTrackerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      logedInOn: currentTime,
    };
  }

  private convertAuthoTrackerRawValueToAuthoTracker(
    rawAuthoTracker: AuthoTrackerFormRawValue | NewAuthoTrackerFormRawValue
  ): IAuthoTracker | NewAuthoTracker {
    return {
      ...rawAuthoTracker,
      logedInOn: dayjs(rawAuthoTracker.logedInOn, DATE_TIME_FORMAT),
    };
  }

  private convertAuthoTrackerToAuthoTrackerRawValue(
    authoTracker: IAuthoTracker | (Partial<NewAuthoTracker> & AuthoTrackerFormDefaults)
  ): AuthoTrackerFormRawValue | PartialWithRequiredKeyOf<NewAuthoTrackerFormRawValue> {
    return {
      ...authoTracker,
      logedInOn: authoTracker.logedInOn ? authoTracker.logedInOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
