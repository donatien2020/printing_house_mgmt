import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DeliveryFormService, DeliveryFormGroup } from './delivery-form.service';
import { IDelivery } from '../delivery.model';
import { DeliveryService } from '../service/delivery.service';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';
import { IClientReceptionOrder } from 'app/entities/client-reception-order/client-reception-order.model';
import { ClientReceptionOrderService } from 'app/entities/client-reception-order/service/client-reception-order.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { DeliveryStatuses } from 'app/entities/enumerations/delivery-statuses.model';

@Component({
  selector: 'jhi-delivery-update',
  templateUrl: './delivery-update.component.html',
})
export class DeliveryUpdateComponent implements OnInit {
  isSaving = false;
  delivery: IDelivery | null = null;
  deliveryStatusesValues = Object.keys(DeliveryStatuses);
  ordersSharedCollection: IClientReceptionOrder[] = [];
  documentsSharedCollection: IAttachment[] = [];
  locationsSharedCollection: ILocation[] = [];
  editForm: DeliveryFormGroup = this.deliveryFormService.createDeliveryFormGroup();

  constructor(
    protected deliveryService: DeliveryService,
    protected deliveryFormService: DeliveryFormService,
    protected orderService: ClientReceptionOrderService,
    protected documentService: AttachmentService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute
  ) {}


    compareClientOrder = (o1: IClientReceptionOrder | null, o2: IClientReceptionOrder | null): boolean => this.orderService.compareClientReceptionOrder(o1, o2);
    compareDocument = (o1: IAttachment | null, o2: IAttachment | null): boolean => this.documentService.compareAttachment(o1, o2);
    compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ delivery }) => {
      this.delivery = delivery;
      if (delivery) {
        this.updateForm(delivery);
      }
      this.loadRelationshipsOptions();

    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const delivery = this.deliveryFormService.getDelivery(this.editForm);
    if (delivery.id !== null) {
      this.subscribeToSaveResponse(this.deliveryService.update(delivery));
    } else {
      this.subscribeToSaveResponse(this.deliveryService.create(delivery));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDelivery>>): void {
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

  protected updateForm(delivery: IDelivery): void {
    this.delivery = delivery;
    this.deliveryFormService.resetForm(this.editForm, delivery);
    this.ordersSharedCollection = this.orderService.addClientReceptionOrderToCollectionIfMissing<IClientReceptionOrder>(
          this.ordersSharedCollection,
          delivery.receiptionOrder
        );
    this.documentsSharedCollection = this.documentService.addAttachmentToCollectionIfMissing<IAttachment>(
          this.documentsSharedCollection,
          delivery.document
        );
    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
          this.locationsSharedCollection,
          delivery.location
        );
  }

  protected loadRelationshipsOptions(): void {
      this.orderService
        .query()
        .pipe(map((res: HttpResponse<IClientReceptionOrder[]>) => res.body ?? []))
        .pipe(
          map((orders: IClientReceptionOrder[]) =>
            this.orderService.addClientReceptionOrderToCollectionIfMissing<IClientReceptionOrder>(orders, this.delivery?.receiptionOrder)
          )
        ).subscribe((orders: IClientReceptionOrder[]) => (this.ordersSharedCollection = orders));

      this.documentService
        .query()
        .pipe(map((res: HttpResponse<IAttachment[]>) => res.body ?? []))
        .pipe(
          map((attachments: IAttachment[]) =>
            this.documentService.addAttachmentToCollectionIfMissing<IAttachment>(attachments, this.delivery?.document)
          )
        ).subscribe((attachments: IAttachment[]) => (this.documentsSharedCollection = attachments));

      this.locationService
        .query()
        .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
        .pipe(
          map((locations: ILocation[]) =>
            this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.delivery?.location)
          )
        ).subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
    }
  }

