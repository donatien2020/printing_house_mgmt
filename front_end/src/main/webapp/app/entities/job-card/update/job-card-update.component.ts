import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { JobCardFormService, JobCardFormGroup } from './job-card-form.service';
import { IJobCard } from '../job-card.model';
import { JobCardService } from '../service/job-card.service';
import { IClientReceptionOrder } from 'app/entities/client-reception-order/client-reception-order.model';
import { ClientReceptionOrderService } from 'app/entities/client-reception-order/service/client-reception-order.service';
import { PerformanceMeasures } from 'app/entities/enumerations/performance-measures.model';
import { JobCardStatuses } from 'app/entities/enumerations/job-card-statuses.model';

@Component({
  selector: 'jhi-job-card-update',
  templateUrl: './job-card-update.component.html',
})
export class JobCardUpdateComponent implements OnInit {
  isSaving = false;
  jobCard: IJobCard | null = null;
  performanceMeasuresValues = Object.keys(PerformanceMeasures);
  jobCardStatusesValues = Object.keys(JobCardStatuses);

  clientReceptionOrdersSharedCollection: IClientReceptionOrder[] = [];

  editForm: JobCardFormGroup = this.jobCardFormService.createJobCardFormGroup();

  constructor(
    protected jobCardService: JobCardService,
    protected jobCardFormService: JobCardFormService,
    protected clientReceptionOrderService: ClientReceptionOrderService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClientReceptionOrder = (o1: IClientReceptionOrder | null, o2: IClientReceptionOrder | null): boolean =>
    this.clientReceptionOrderService.compareClientReceptionOrder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCard }) => {
      this.jobCard = jobCard;
      if (jobCard) {
        this.updateForm(jobCard);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobCard = this.jobCardFormService.getJobCard(this.editForm);
    if (jobCard.id !== null) {
      this.subscribeToSaveResponse(this.jobCardService.update(jobCard));
    } else {
      this.subscribeToSaveResponse(this.jobCardService.create(jobCard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobCard>>): void {
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

  protected updateForm(jobCard: IJobCard): void {
    this.jobCard = jobCard;
    this.jobCardFormService.resetForm(this.editForm, jobCard);

    this.clientReceptionOrdersSharedCollection =
      this.clientReceptionOrderService.addClientReceptionOrderToCollectionIfMissing<IClientReceptionOrder>(
        this.clientReceptionOrdersSharedCollection,
        jobCard.clientReceptionOrder
      );
  }

  protected loadRelationshipsOptions(): void {
    this.clientReceptionOrderService
      .query()
      .pipe(map((res: HttpResponse<IClientReceptionOrder[]>) => res.body ?? []))
      .pipe(
        map((clientReceptionOrders: IClientReceptionOrder[]) =>
          this.clientReceptionOrderService.addClientReceptionOrderToCollectionIfMissing<IClientReceptionOrder>(
            clientReceptionOrders,
            this.jobCard?.clientReceptionOrder
          )
        )
      )
      .subscribe((clientReceptionOrders: IClientReceptionOrder[]) => (this.clientReceptionOrdersSharedCollection = clientReceptionOrders));
  }
}
