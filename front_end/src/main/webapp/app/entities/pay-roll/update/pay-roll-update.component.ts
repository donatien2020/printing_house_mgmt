import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PayRollFormService, PayRollFormGroup } from './pay-roll-form.service';
import { IPayRoll } from '../pay-roll.model';
import { PayRollService } from '../service/pay-roll.service';
import { PaymentStatuses } from 'app/entities/enumerations/payment-statuses.model';

@Component({
  selector: 'jhi-pay-roll-update',
  templateUrl: './pay-roll-update.component.html',
})
export class PayRollUpdateComponent implements OnInit {
  isSaving = false;
  payRoll: IPayRoll | null = null;
  paymentStatusesValues = Object.keys(PaymentStatuses);

  editForm: PayRollFormGroup = this.payRollFormService.createPayRollFormGroup();

  constructor(
    protected payRollService: PayRollService,
    protected payRollFormService: PayRollFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payRoll }) => {
      this.payRoll = payRoll;
      if (payRoll) {
        this.updateForm(payRoll);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payRoll = this.payRollFormService.getPayRoll(this.editForm);
    if (payRoll.id !== null) {
      this.subscribeToSaveResponse(this.payRollService.update(payRoll));
    } else {
      this.subscribeToSaveResponse(this.payRollService.create(payRoll));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayRoll>>): void {
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

  protected updateForm(payRoll: IPayRoll): void {
    this.payRoll = payRoll;
    this.payRollFormService.resetForm(this.editForm, payRoll);
  }
}
