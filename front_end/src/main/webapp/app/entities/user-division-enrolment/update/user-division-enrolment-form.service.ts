import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserDivisionEnrolment, NewUserDivisionEnrolment } from '../user-division-enrolment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserDivisionEnrolment for edit and NewUserDivisionEnrolmentFormGroupInput for create.
 */
type UserDivisionEnrolmentFormGroupInput = IUserDivisionEnrolment | PartialWithRequiredKeyOf<NewUserDivisionEnrolment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserDivisionEnrolment | NewUserDivisionEnrolment> = Omit<T, 'startedOn' | 'endedOn'> & {
  startedOn?: string | null;
  endedOn?: string | null;
};

type UserDivisionEnrolmentFormRawValue = FormValueOf<IUserDivisionEnrolment>;

type NewUserDivisionEnrolmentFormRawValue = FormValueOf<NewUserDivisionEnrolment>;

type UserDivisionEnrolmentFormDefaults = Pick<NewUserDivisionEnrolment, 'id' | 'startedOn' | 'endedOn'>;

type UserDivisionEnrolmentFormGroupContent = {
  id: FormControl<UserDivisionEnrolmentFormRawValue['id'] | NewUserDivisionEnrolment['id']>;
  startedOn: FormControl<UserDivisionEnrolmentFormRawValue['startedOn']>;
  endedOn: FormControl<UserDivisionEnrolmentFormRawValue['endedOn']>;
  status: FormControl<UserDivisionEnrolmentFormRawValue['status']>;
  user: FormControl<UserDivisionEnrolmentFormRawValue['user']>;
  division: FormControl<UserDivisionEnrolmentFormRawValue['division']>;
};

export type UserDivisionEnrolmentFormGroup = FormGroup<UserDivisionEnrolmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserDivisionEnrolmentFormService {
  createUserDivisionEnrolmentFormGroup(
    userDivisionEnrolment: UserDivisionEnrolmentFormGroupInput = { id: null }
  ): UserDivisionEnrolmentFormGroup {
    const userDivisionEnrolmentRawValue = this.convertUserDivisionEnrolmentToUserDivisionEnrolmentRawValue({
      ...this.getFormDefaults(),
      ...userDivisionEnrolment,
    });
    return new FormGroup<UserDivisionEnrolmentFormGroupContent>({
      id: new FormControl(
        { value: userDivisionEnrolmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startedOn: new FormControl(userDivisionEnrolmentRawValue.startedOn, {
        validators: [Validators.required],
      }),
      endedOn: new FormControl(userDivisionEnrolmentRawValue.endedOn),
      status: new FormControl(userDivisionEnrolmentRawValue.status, {
        validators: [Validators.required],
      }),
      user: new FormControl(userDivisionEnrolmentRawValue.user),
      division: new FormControl(userDivisionEnrolmentRawValue.division),
    });
  }

  getUserDivisionEnrolment(form: UserDivisionEnrolmentFormGroup): IUserDivisionEnrolment | NewUserDivisionEnrolment {
    return this.convertUserDivisionEnrolmentRawValueToUserDivisionEnrolment(
      form.getRawValue() as UserDivisionEnrolmentFormRawValue | NewUserDivisionEnrolmentFormRawValue
    );
  }

  resetForm(form: UserDivisionEnrolmentFormGroup, userDivisionEnrolment: UserDivisionEnrolmentFormGroupInput): void {
    const userDivisionEnrolmentRawValue = this.convertUserDivisionEnrolmentToUserDivisionEnrolmentRawValue({
      ...this.getFormDefaults(),
      ...userDivisionEnrolment,
    });
    form.reset(
      {
        ...userDivisionEnrolmentRawValue,
        id: { value: userDivisionEnrolmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserDivisionEnrolmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startedOn: currentTime,
      endedOn: currentTime,
    };
  }

  private convertUserDivisionEnrolmentRawValueToUserDivisionEnrolment(
    rawUserDivisionEnrolment: UserDivisionEnrolmentFormRawValue | NewUserDivisionEnrolmentFormRawValue
  ): IUserDivisionEnrolment | NewUserDivisionEnrolment {
    return {
      ...rawUserDivisionEnrolment,
      startedOn: dayjs(rawUserDivisionEnrolment.startedOn, DATE_TIME_FORMAT),
      endedOn: dayjs(rawUserDivisionEnrolment.endedOn, DATE_TIME_FORMAT),
    };
  }

  private convertUserDivisionEnrolmentToUserDivisionEnrolmentRawValue(
    userDivisionEnrolment: IUserDivisionEnrolment | (Partial<NewUserDivisionEnrolment> & UserDivisionEnrolmentFormDefaults)
  ): UserDivisionEnrolmentFormRawValue | PartialWithRequiredKeyOf<NewUserDivisionEnrolmentFormRawValue> {
    return {
      ...userDivisionEnrolment,
      startedOn: userDivisionEnrolment.startedOn ? userDivisionEnrolment.startedOn.format(DATE_TIME_FORMAT) : undefined,
      endedOn: userDivisionEnrolment.endedOn ? userDivisionEnrolment.endedOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
