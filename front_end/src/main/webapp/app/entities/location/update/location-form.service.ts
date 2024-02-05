import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILocation, NewLocation } from '../location.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocation for edit and NewLocationFormGroupInput for create.
 */
type LocationFormGroupInput = ILocation | PartialWithRequiredKeyOf<NewLocation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILocation | NewLocation> = Omit<T, 'createdOn' | 'updatedOn'> & {
  createdOn?: string | null;
  updatedOn?: string | null;
};

type LocationFormRawValue = FormValueOf<ILocation>;

type NewLocationFormRawValue = FormValueOf<NewLocation>;

type LocationFormDefaults = Pick<NewLocation, 'id' | 'createdOn' | 'updatedOn'>;

type LocationFormGroupContent = {
  id: FormControl<LocationFormRawValue['id'] | NewLocation['id']>;
  code: FormControl<LocationFormRawValue['code']>;
  name: FormControl<LocationFormRawValue['name']>;
  description: FormControl<LocationFormRawValue['description']>;
  createdOn: FormControl<LocationFormRawValue['createdOn']>;
  createdById: FormControl<LocationFormRawValue['createdById']>;
  createdByUsername: FormControl<LocationFormRawValue['createdByUsername']>;
  updatedById: FormControl<LocationFormRawValue['updatedById']>;
  updatedByUsername: FormControl<LocationFormRawValue['updatedByUsername']>;
  updatedOn: FormControl<LocationFormRawValue['updatedOn']>;
  parent: FormControl<LocationFormRawValue['parent']>;
  level: FormControl<LocationFormRawValue['level']>;
};

export type LocationFormGroup = FormGroup<LocationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocationFormService {
  createLocationFormGroup(location: LocationFormGroupInput = { id: null }): LocationFormGroup {
    const locationRawValue = this.convertLocationToLocationRawValue({
      ...this.getFormDefaults(),
      ...location,
    });
    return new FormGroup<LocationFormGroupContent>({
      id: new FormControl(
        { value: locationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(locationRawValue.code, {
        validators: [Validators.required],
      }),
      name: new FormControl(locationRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(locationRawValue.description),
      createdOn: new FormControl(locationRawValue.createdOn),
      createdById: new FormControl(locationRawValue.createdById),
      createdByUsername: new FormControl(locationRawValue.createdByUsername),
      updatedById: new FormControl(locationRawValue.updatedById),
      updatedByUsername: new FormControl(locationRawValue.updatedByUsername),
      updatedOn: new FormControl(locationRawValue.updatedOn),
      parent: new FormControl(locationRawValue.parent),
      level: new FormControl(locationRawValue.level),
    });
  }

  getLocation(form: LocationFormGroup): ILocation | NewLocation {
    return this.convertLocationRawValueToLocation(form.getRawValue() as LocationFormRawValue | NewLocationFormRawValue);
  }

  resetForm(form: LocationFormGroup, location: LocationFormGroupInput): void {
    const locationRawValue = this.convertLocationToLocationRawValue({ ...this.getFormDefaults(), ...location });
    form.reset(
      {
        ...locationRawValue,
        id: { value: locationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LocationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdOn: currentTime,
      updatedOn: currentTime,
    };
  }

  private convertLocationRawValueToLocation(rawLocation: LocationFormRawValue | NewLocationFormRawValue): ILocation | NewLocation {
    return {
      ...rawLocation,
      createdOn: dayjs(rawLocation.createdOn, DATE_TIME_FORMAT),
      updatedOn: dayjs(rawLocation.updatedOn, DATE_TIME_FORMAT),
    };
  }

  private convertLocationToLocationRawValue(
    location: ILocation | (Partial<NewLocation> & LocationFormDefaults)
  ): LocationFormRawValue | PartialWithRequiredKeyOf<NewLocationFormRawValue> {
    return {
      ...location,
      createdOn: location.createdOn ? location.createdOn.format(DATE_TIME_FORMAT) : undefined,
      updatedOn: location.updatedOn ? location.updatedOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
