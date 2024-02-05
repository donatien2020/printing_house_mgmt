import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { InvoiceHistoryFormService, InvoiceHistoryFormGroup } from './invoice-history-form.service';
import { IInvoiceHistory } from '../invoice-history.model';
import { InvoiceHistoryService } from '../service/invoice-history.service';
import { InvoiceActions } from 'app/entities/enumerations/invoice-actions.model';

@Component({
  selector: 'jhi-invoice-history-update',
  templateUrl: './invoice-history-update.component.html',
})
export class InvoiceHistoryUpdateComponent implements OnInit {
  isSaving = false;
  invoiceHistory: IInvoiceHistory | null = null;
  invoiceActionsValues = Object.keys(InvoiceActions);

  editForm: InvoiceHistoryFormGroup = this.invoiceHistoryFormService.createInvoiceHistoryFormGroup();

  constructor(
    protected invoiceHistoryService: InvoiceHistoryService,
    protected invoiceHistoryFormService: InvoiceHistoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoiceHistory }) => {
      this.invoiceHistory = invoiceHistory;
      if (invoiceHistory) {
        this.updateForm(invoiceHistory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoiceHistory = this.invoiceHistoryFormService.getInvoiceHistory(this.editForm);
    if (invoiceHistory.id !== null) {
      this.subscribeToSaveResponse(this.invoiceHistoryService.update(invoiceHistory));
    } else {
      this.subscribeToSaveResponse(this.invoiceHistoryService.create(invoiceHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoiceHistory>>): void {
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

  protected updateForm(invoiceHistory: IInvoiceHistory): void {
    this.invoiceHistory = invoiceHistory;
    this.invoiceHistoryFormService.resetForm(this.editForm, invoiceHistory);
  }
}
