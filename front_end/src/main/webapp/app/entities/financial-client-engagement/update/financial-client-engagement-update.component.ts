import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FinancialClientEngagementFormService, FinancialClientEngagementFormGroup } from './financial-client-engagement-form.service';
import { IFinancialClientEngagement } from '../financial-client-engagement.model';
import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';
import { EngagementReasons } from 'app/entities/enumerations/engagement-reasons.model';

@Component({
  selector: 'jhi-financial-client-engagement-update',
  templateUrl: './financial-client-engagement-update.component.html',
})
export class FinancialClientEngagementUpdateComponent implements OnInit {
  isSaving = false;
  financialClientEngagement: IFinancialClientEngagement | null = null;
  engagementReasonsValues = Object.keys(EngagementReasons);

  editForm: FinancialClientEngagementFormGroup = this.financialClientEngagementFormService.createFinancialClientEngagementFormGroup();

  constructor(
    protected financialClientEngagementService: FinancialClientEngagementService,
    protected financialClientEngagementFormService: FinancialClientEngagementFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialClientEngagement }) => {
      this.financialClientEngagement = financialClientEngagement;
      if (financialClientEngagement) {
        this.updateForm(financialClientEngagement);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const financialClientEngagement = this.financialClientEngagementFormService.getFinancialClientEngagement(this.editForm);
    if (financialClientEngagement.id !== null) {
      this.subscribeToSaveResponse(this.financialClientEngagementService.update(financialClientEngagement));
    } else {
      this.subscribeToSaveResponse(this.financialClientEngagementService.create(financialClientEngagement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinancialClientEngagement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(financialClientEngagement: IFinancialClientEngagement): void {
    this.financialClientEngagement = financialClientEngagement;
    this.financialClientEngagementFormService.resetForm(this.editForm, financialClientEngagement);
  }
}
