import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { JobCardItemFormService, JobCardItemFormGroup } from './job-card-item-form.service';
import { IJobCardItem } from '../job-card-item.model';
import { JobCardItemService } from '../service/job-card-item.service';
import { IJobCard } from 'app/entities/job-card/job-card.model';
import { JobCardService } from 'app/entities/job-card/service/job-card.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { JobCardItemStatuses } from 'app/entities/enumerations/job-card-item-statuses.model';

@Component({
  selector: 'jhi-job-card-item-update',
  templateUrl: './job-card-item-update.component.html',
})
export class JobCardItemUpdateComponent implements OnInit {
  isSaving = false;
  jobCardItem: IJobCardItem | null = null;
  jobCardItemStatusesValues = Object.keys(JobCardItemStatuses);

  jobCardsSharedCollection: IJobCard[] = [];
  productsSharedCollection: IProduct[] = [];

  editForm: JobCardItemFormGroup = this.jobCardItemFormService.createJobCardItemFormGroup();

  constructor(
    protected jobCardItemService: JobCardItemService,
    protected jobCardItemFormService: JobCardItemFormService,
    protected jobCardService: JobCardService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareJobCard = (o1: IJobCard | null, o2: IJobCard | null): boolean => this.jobCardService.compareJobCard(o1, o2);

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCardItem }) => {
      this.jobCardItem = jobCardItem;
      if (jobCardItem) {
        this.updateForm(jobCardItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobCardItem = this.jobCardItemFormService.getJobCardItem(this.editForm);
    if (jobCardItem.id !== null) {
      this.subscribeToSaveResponse(this.jobCardItemService.update(jobCardItem));
    } else {
      this.subscribeToSaveResponse(this.jobCardItemService.create(jobCardItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobCardItem>>): void {
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

  protected updateForm(jobCardItem: IJobCardItem): void {
    this.jobCardItem = jobCardItem;
    this.jobCardItemFormService.resetForm(this.editForm, jobCardItem);

    this.jobCardsSharedCollection = this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(
      this.jobCardsSharedCollection,
      jobCardItem.card
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      jobCardItem.product
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobCardService
      .query()
      .pipe(map((res: HttpResponse<IJobCard[]>) => res.body ?? []))
      .pipe(map((jobCards: IJobCard[]) => this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(jobCards, this.jobCardItem?.card)))
      .subscribe((jobCards: IJobCard[]) => (this.jobCardsSharedCollection = jobCards));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, this.jobCardItem?.product))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }
}
