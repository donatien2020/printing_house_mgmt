import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobCard, NewJobCard } from '../job-card.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobCard for edit and NewJobCardFormGroupInput for create.
 */
type JobCardFormGroupInput = IJobCard | PartialWithRequiredKeyOf<NewJobCard>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobCard | NewJobCard> = Omit<T, 'startedOn' | 'completedOn'> & {
  startedOn?: string | null;
  completedOn?: string | null;
};

type JobCardFormRawValue = FormValueOf<IJobCard>;

type NewJobCardFormRawValue = FormValueOf<NewJobCard>;

type JobCardFormDefaults = Pick<NewJobCard, 'id' | 'startedOn' | 'completedOn'>;

type JobCardFormGroupContent = {
  id: FormControl<JobCardFormRawValue['id'] | NewJobCard['id']>;
  description: FormControl<JobCardFormRawValue['description']>;
  quantity: FormControl<JobCardFormRawValue['quantity']>;
  unitPrice: FormControl<JobCardFormRawValue['unitPrice']>;
  startedOn: FormControl<JobCardFormRawValue['startedOn']>;
  completedOn: FormControl<JobCardFormRawValue['completedOn']>;
  divisionId: FormControl<JobCardFormRawValue['divisionId']>;
  divisionName: FormControl<JobCardFormRawValue['divisionName']>;
  performance: FormControl<JobCardFormRawValue['performance']>;
  status: FormControl<JobCardFormRawValue['status']>;
  clientReceptionOrder: FormControl<JobCardFormRawValue['clientReceptionOrder']>;
};

export type JobCardFormGroup = FormGroup<JobCardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobCardFormService {
  createJobCardFormGroup(jobCard: JobCardFormGroupInput = { id: null }): JobCardFormGroup {
    const jobCardRawValue = this.convertJobCardToJobCardRawValue({
      ...this.getFormDefaults(),
      ...jobCard,
    });
    return new FormGroup<JobCardFormGroupContent>({
      id: new FormControl(
        { value: jobCardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(jobCardRawValue.description),
      quantity: new FormControl(jobCardRawValue.quantity, {
        validators: [Validators.required],
      }),
      unitPrice: new FormControl(jobCardRawValue.unitPrice, {
        validators: [Validators.required],
      }),
      startedOn: new FormControl(jobCardRawValue.startedOn),
      completedOn: new FormControl(jobCardRawValue.completedOn),
      divisionId: new FormControl(jobCardRawValue.divisionId, {
        validators: [Validators.required],
      }),
      divisionName: new FormControl(jobCardRawValue.divisionName, {
        validators: [Validators.required],
      }),
      performance: new FormControl(jobCardRawValue.performance, {
        validators: [Validators.required],
      }),
      status: new FormControl(jobCardRawValue.status, {
        validators: [Validators.required],
      }),
      clientReceptionOrder: new FormControl(jobCardRawValue.clientReceptionOrder),
    });
  }

  getJobCard(form: JobCardFormGroup): IJobCard | NewJobCard {
    return this.convertJobCardRawValueToJobCard(form.getRawValue() as JobCardFormRawValue | NewJobCardFormRawValue);
  }

  resetForm(form: JobCardFormGroup, jobCard: JobCardFormGroupInput): void {
    const jobCardRawValue = this.convertJobCardToJobCardRawValue({ ...this.getFormDefaults(), ...jobCard });
    form.reset(
      {
        ...jobCardRawValue,
        id: { value: jobCardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobCardFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startedOn: currentTime,
      completedOn: currentTime,
    };
  }

  private convertJobCardRawValueToJobCard(rawJobCard: JobCardFormRawValue | NewJobCardFormRawValue): IJobCard | NewJobCard {
    return {
      ...rawJobCard,
      startedOn: dayjs(rawJobCard.startedOn, DATE_TIME_FORMAT),
      completedOn: dayjs(rawJobCard.completedOn, DATE_TIME_FORMAT),
    };
  }

  private convertJobCardToJobCardRawValue(
    jobCard: IJobCard | (Partial<NewJobCard> & JobCardFormDefaults)
  ): JobCardFormRawValue | PartialWithRequiredKeyOf<NewJobCardFormRawValue> {
    return {
      ...jobCard,
      startedOn: jobCard.startedOn ? jobCard.startedOn.format(DATE_TIME_FORMAT) : undefined,
      completedOn: jobCard.completedOn ? jobCard.completedOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
