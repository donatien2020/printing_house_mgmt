import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFinancialClientEngagement, NewFinancialClientEngagement } from '../financial-client-engagement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFinancialClientEngagement for edit and NewFinancialClientEngagementFormGroupInput for create.
 */
type FinancialClientEngagementFormGroupInput = IFinancialClientEngagement | PartialWithRequiredKeyOf<NewFinancialClientEngagement>;

type FinancialClientEngagementFormDefaults = Pick<NewFinancialClientEngagement, 'id'>;

type FinancialClientEngagementFormGroupContent = {
  id: FormControl<IFinancialClientEngagement['id'] | NewFinancialClientEngagement['id']>;
  userId: FormControl<IFinancialClientEngagement['userId']>;
  clientId: FormControl<IFinancialClientEngagement['clientId']>;
  clientNames: FormControl<IFinancialClientEngagement['clientNames']>;
  discussionSummary: FormControl<IFinancialClientEngagement['discussionSummary']>;
  reason: FormControl<IFinancialClientEngagement['reason']>;
  conclusion: FormControl<IFinancialClientEngagement['conclusion']>;
  contractId: FormControl<IFinancialClientEngagement['contractId']>;
};

export type FinancialClientEngagementFormGroup = FormGroup<FinancialClientEngagementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FinancialClientEngagementFormService {
  createFinancialClientEngagementFormGroup(
    financialClientEngagement: FinancialClientEngagementFormGroupInput = { id: null }
  ): FinancialClientEngagementFormGroup {
    const financialClientEngagementRawValue = {
      ...this.getFormDefaults(),
      ...financialClientEngagement,
    };
    return new FormGroup<FinancialClientEngagementFormGroupContent>({
      id: new FormControl(
        { value: financialClientEngagementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(financialClientEngagementRawValue.userId, {
        validators: [Validators.required],
      }),
      clientId: new FormControl(financialClientEngagementRawValue.clientId, {
        validators: [Validators.required],
      }),
      clientNames: new FormControl(financialClientEngagementRawValue.clientNames, {
        validators: [Validators.required],
      }),
      discussionSummary: new FormControl(financialClientEngagementRawValue.discussionSummary),
      reason: new FormControl(financialClientEngagementRawValue.reason, {
        validators: [Validators.required],
      }),
      conclusion: new FormControl(financialClientEngagementRawValue.conclusion),
      contractId: new FormControl(financialClientEngagementRawValue.contractId),
    });
  }

  getFinancialClientEngagement(form: FinancialClientEngagementFormGroup): IFinancialClientEngagement | NewFinancialClientEngagement {
    return form.getRawValue() as IFinancialClientEngagement | NewFinancialClientEngagement;
  }

  resetForm(form: FinancialClientEngagementFormGroup, financialClientEngagement: FinancialClientEngagementFormGroupInput): void {
    const financialClientEngagementRawValue = { ...this.getFormDefaults(), ...financialClientEngagement };
    form.reset(
      {
        ...financialClientEngagementRawValue,
        id: { value: financialClientEngagementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FinancialClientEngagementFormDefaults {
    return {
      id: null,
    };
  }
}
