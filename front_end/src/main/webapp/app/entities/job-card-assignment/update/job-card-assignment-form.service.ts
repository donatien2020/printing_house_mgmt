import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJobCardAssignment, NewJobCardAssignment } from '../job-card-assignment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobCardAssignment for edit and NewJobCardAssignmentFormGroupInput for create.
 */
type JobCardAssignmentFormGroupInput = IJobCardAssignment | PartialWithRequiredKeyOf<NewJobCardAssignment>;

type JobCardAssignmentFormDefaults = Pick<NewJobCardAssignment, 'id'>;

type JobCardAssignmentFormGroupContent = {
  id: FormControl<IJobCardAssignment['id'] | NewJobCardAssignment['id']>;
  assignedToId: FormControl<IJobCardAssignment['assignedToId']>;
  assignedNames: FormControl<IJobCardAssignment['assignedNames']>;
  description: FormControl<IJobCardAssignment['description']>;
  assignmentMode: FormControl<IJobCardAssignment['assignmentMode']>;
  status: FormControl<IJobCardAssignment['status']>;
  jobCard: FormControl<IJobCardAssignment['jobCard']>;
};

export type JobCardAssignmentFormGroup = FormGroup<JobCardAssignmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobCardAssignmentFormService {
  createJobCardAssignmentFormGroup(jobCardAssignment: JobCardAssignmentFormGroupInput = { id: null }): JobCardAssignmentFormGroup {
    const jobCardAssignmentRawValue = {
      ...this.getFormDefaults(),
      ...jobCardAssignment,
    };
    return new FormGroup<JobCardAssignmentFormGroupContent>({
      id: new FormControl(
        { value: jobCardAssignmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      assignedToId: new FormControl(jobCardAssignmentRawValue.assignedToId, {
        validators: [Validators.required],
      }),
      assignedNames: new FormControl(jobCardAssignmentRawValue.assignedNames, {
        validators: [Validators.required],
      }),
      description: new FormControl(jobCardAssignmentRawValue.description, {
        validators: [Validators.required],
      }),
      assignmentMode: new FormControl(jobCardAssignmentRawValue.assignmentMode, {
        validators: [Validators.required],
      }),
      status: new FormControl(jobCardAssignmentRawValue.status, {
        validators: [Validators.required],
      }),
      jobCard: new FormControl(jobCardAssignmentRawValue.jobCard),
    });
  }

  getJobCardAssignment(form: JobCardAssignmentFormGroup): IJobCardAssignment | NewJobCardAssignment {
    return form.getRawValue() as IJobCardAssignment | NewJobCardAssignment;
  }

  resetForm(form: JobCardAssignmentFormGroup, jobCardAssignment: JobCardAssignmentFormGroupInput): void {
    const jobCardAssignmentRawValue = { ...this.getFormDefaults(), ...jobCardAssignment };
    form.reset(
      {
        ...jobCardAssignmentRawValue,
        id: { value: jobCardAssignmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobCardAssignmentFormDefaults {
    return {
      id: null,
    };
  }
}
