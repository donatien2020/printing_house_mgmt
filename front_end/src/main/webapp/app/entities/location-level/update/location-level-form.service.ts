import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILocationLevel, NewLocationLevel } from '../location-level.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocationLevel for edit and NewLocationLevelFormGroupInput for create.
 */
type LocationLevelFormGroupInput = ILocationLevel | PartialWithRequiredKeyOf<NewLocationLevel>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILocationLevel | NewLocationLevel> = Omit<T, 'createdOn' | 'updatedOn'> & {
  createdOn?: string | null;
  updatedOn?: string | null;
};

type LocationLevelFormRawValue = FormValueOf<ILocationLevel>;

type NewLocationLevelFormRawValue = FormValueOf<NewLocationLevel>;

type LocationLevelFormDefaults = Pick<NewLocationLevel, 'id' | 'createdOn' | 'updatedOn'>;

type LocationLevelFormGroupContent = {
  id: FormControl<LocationLevelFormRawValue['id'] | NewLocationLevel['id']>;
  code: FormControl<LocationLevelFormRawValue['code']>;
  name: FormControl<LocationLevelFormRawValue['name']>;
  createdOn: FormControl<LocationLevelFormRawValue['createdOn']>;
  createdById: FormControl<LocationLevelFormRawValue['createdById']>;
  createdByUsername: FormControl<LocationLevelFormRawValue['createdByUsername']>;
  updatedById: FormControl<LocationLevelFormRawValue['updatedById']>;
  updatedByUsername: FormControl<LocationLevelFormRawValue['updatedByUsername']>;
  updatedOn: FormControl<LocationLevelFormRawValue['updatedOn']>;
};

export type LocationLevelFormGroup = FormGroup<LocationLevelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocationLevelFormService {
  createLocationLevelFormGroup(locationLevel: LocationLevelFormGroupInput = { id: null }): LocationLevelFormGroup {
    const locationLevelRawValue = this.convertLocationLevelToLocationLevelRawValue({
      ...this.getFormDefaults(),
      ...locationLevel,
    });
    return new FormGroup<LocationLevelFormGroupContent>({
      id: new FormControl(
        { value: locationLevelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(locationLevelRawValue.code, {
        validators: [Validators.required],
      }),
      name: new FormControl(locationLevelRawValue.name, {
        validators: [Validators.required],
      }),
      createdOn: new FormControl(locationLevelRawValue.createdOn),
      createdById: new FormControl(locationLevelRawValue.createdById),
      createdByUsername: new FormControl(locationLevelRawValue.createdByUsername),
      updatedById: new FormControl(locationLevelRawValue.updatedById),
      updatedByUsername: new FormControl(locationLevelRawValue.updatedByUsername),
      updatedOn: new FormControl(locationLevelRawValue.updatedOn),
    });
  }

  getLocationLevel(form: LocationLevelFormGroup): ILocationLevel | NewLocationLevel {
    return this.convertLocationLevelRawValueToLocationLevel(form.getRawValue() as LocationLevelFormRawValue | NewLocationLevelFormRawValue);
  }

  resetForm(form: LocationLevelFormGroup, locationLevel: LocationLevelFormGroupInput): void {
    const locationLevelRawValue = this.convertLocationLevelToLocationLevelRawValue({ ...this.getFormDefaults(), ...locationLevel });
    form.reset(
      {
        ...locationLevelRawValue,
        id: { value: locationLevelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LocationLevelFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdOn: currentTime,
      updatedOn: currentTime,
    };
  }

  private convertLocationLevelRawValueToLocationLevel(
    rawLocationLevel: LocationLevelFormRawValue | NewLocationLevelFormRawValue
  ): ILocationLevel | NewLocationLevel {
    return {
      ...rawLocationLevel,
      createdOn: dayjs(rawLocationLevel.createdOn, DATE_TIME_FORMAT),
      updatedOn: dayjs(rawLocationLevel.updatedOn, DATE_TIME_FORMAT),
    };
  }

  private convertLocationLevelToLocationLevelRawValue(
    locationLevel: ILocationLevel | (Partial<NewLocationLevel> & LocationLevelFormDefaults)
  ): LocationLevelFormRawValue | PartialWithRequiredKeyOf<NewLocationLevelFormRawValue> {
    return {
      ...locationLevel,
      createdOn: locationLevel.createdOn ? locationLevel.createdOn.format(DATE_TIME_FORMAT) : undefined,
      updatedOn: locationLevel.updatedOn ? locationLevel.updatedOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
