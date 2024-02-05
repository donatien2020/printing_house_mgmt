import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { InvoiceItemFormService, InvoiceItemFormGroup } from './invoice-item-form.service';
import { IInvoiceItem } from '../invoice-item.model';
import { InvoiceItemService } from '../service/invoice-item.service';
import { InvoiceItemTypes } from 'app/entities/enumerations/invoice-item-types.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-invoice-item-update',
  templateUrl: './invoice-item-update.component.html',
})
export class InvoiceItemUpdateComponent implements OnInit {
  isSaving = false;
  invoiceItem: IInvoiceItem | null = null;
  invoiceItemTypesValues = Object.keys(InvoiceItemTypes);
  statusValues = Object.keys(Status);

  editForm: InvoiceItemFormGroup = this.invoiceItemFormService.createInvoiceItemFormGroup();

  constructor(
    protected invoiceItemService: InvoiceItemService,
    protected invoiceItemFormService: InvoiceItemFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoiceItem }) => {
      this.invoiceItem = invoiceItem;
      if (invoiceItem) {
        this.updateForm(invoiceItem);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoiceItem = this.invoiceItemFormService.getInvoiceItem(this.editForm);
    if (invoiceItem.id !== null) {
      this.subscribeToSaveResponse(this.invoiceItemService.update(invoiceItem));
    } else {
      this.subscribeToSaveResponse(this.invoiceItemService.create(invoiceItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoiceItem>>): void {
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

  protected updateForm(invoiceItem: IInvoiceItem): void {
    this.invoiceItem = invoiceItem;
    this.invoiceItemFormService.resetForm(this.editForm, invoiceItem);
  }
}
