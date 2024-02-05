import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PayRollItemFormService, PayRollItemFormGroup } from './pay-roll-item-form.service';
import { IPayRollItem } from '../pay-roll-item.model';
import { PayRollItemService } from '../service/pay-roll-item.service';
import { IPayRoll } from 'app/entities/pay-roll/pay-roll.model';
import { PayRollService } from 'app/entities/pay-roll/service/pay-roll.service';
import { SalaryCollectionStatuses } from 'app/entities/enumerations/salary-collection-statuses.model';

@Component({
  selector: 'jhi-pay-roll-item-update',
  templateUrl: './pay-roll-item-update.component.html',
})
export class PayRollItemUpdateComponent implements OnInit {
  isSaving = false;
  payRollItem: IPayRollItem | null = null;
  salaryCollectionStatusesValues = Object.keys(SalaryCollectionStatuses);

  payRollsSharedCollection: IPayRoll[] = [];

  editForm: PayRollItemFormGroup = this.payRollItemFormService.createPayRollItemFormGroup();

  constructor(
    protected payRollItemService: PayRollItemService,
    protected payRollItemFormService: PayRollItemFormService,
    protected payRollService: PayRollService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePayRoll = (o1: IPayRoll | null, o2: IPayRoll | null): boolean => this.payRollService.comparePayRoll(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payRollItem }) => {
      this.payRollItem = payRollItem;
      if (payRollItem) {
        this.updateForm(payRollItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payRollItem = this.payRollItemFormService.getPayRollItem(this.editForm);
    if (payRollItem.id !== null) {
      this.subscribeToSaveResponse(this.payRollItemService.update(payRollItem));
    } else {
      this.subscribeToSaveResponse(this.payRollItemService.create(payRollItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayRollItem>>): void {
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

  protected updateForm(payRollItem: IPayRollItem): void {
    this.payRollItem = payRollItem;
    this.payRollItemFormService.resetForm(this.editForm, payRollItem);

    this.payRollsSharedCollection = this.payRollService.addPayRollToCollectionIfMissing<IPayRoll>(
      this.payRollsSharedCollection,
      payRollItem.payRoll
    );
  }

  protected loadRelationshipsOptions(): void {
    this.payRollService
      .query()
      .pipe(map((res: HttpResponse<IPayRoll[]>) => res.body ?? []))
      .pipe(
        map((payRolls: IPayRoll[]) => this.payRollService.addPayRollToCollectionIfMissing<IPayRoll>(payRolls, this.payRollItem?.payRoll))
      )
      .subscribe((payRolls: IPayRoll[]) => (this.payRollsSharedCollection = payRolls));
  }
}
