import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJobCardItem, NewJobCardItem } from '../job-card-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobCardItem for edit and NewJobCardItemFormGroupInput for create.
 */
type JobCardItemFormGroupInput = IJobCardItem | PartialWithRequiredKeyOf<NewJobCardItem>;

type JobCardItemFormDefaults = Pick<NewJobCardItem, 'id'>;

type JobCardItemFormGroupContent = {
  id: FormControl<IJobCardItem['id'] | NewJobCardItem['id']>;
  quantity: FormControl<IJobCardItem['quantity']>;
  unitPrice: FormControl<IJobCardItem['unitPrice']>;
  status: FormControl<IJobCardItem['status']>;
  card: FormControl<IJobCardItem['card']>;
  product: FormControl<IJobCardItem['product']>;
};

export type JobCardItemFormGroup = FormGroup<JobCardItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobCardItemFormService {
  createJobCardItemFormGroup(jobCardItem: JobCardItemFormGroupInput = { id: null }): JobCardItemFormGroup {
    const jobCardItemRawValue = {
      ...this.getFormDefaults(),
      ...jobCardItem,
    };
    return new FormGroup<JobCardItemFormGroupContent>({
      id: new FormControl(
        { value: jobCardItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(jobCardItemRawValue.quantity, {
        validators: [Validators.required],
      }),
      unitPrice: new FormControl(jobCardItemRawValue.unitPrice, {
        validators: [Validators.required],
      }),
      status: new FormControl(jobCardItemRawValue.status, {
        validators: [Validators.required],
      }),
      card: new FormControl(jobCardItemRawValue.card),
      product: new FormControl(jobCardItemRawValue.product),
    });
  }

  getJobCardItem(form: JobCardItemFormGroup): IJobCardItem | NewJobCardItem {
    return form.getRawValue() as IJobCardItem | NewJobCardItem;
  }

  resetForm(form: JobCardItemFormGroup, jobCardItem: JobCardItemFormGroupInput): void {
    const jobCardItemRawValue = { ...this.getFormDefaults(), ...jobCardItem };
    form.reset(
      {
        ...jobCardItemRawValue,
        id: { value: jobCardItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobCardItemFormDefaults {
    return {
      id: null,
    };
  }
}
