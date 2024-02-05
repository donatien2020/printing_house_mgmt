import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InvoiceFormService, InvoiceFormGroup } from './invoice-form.service';
import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { IDebtor } from 'app/entities/debtor/debtor.model';
import { DebtorService } from 'app/entities/debtor/service/debtor.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { POrganizationService } from 'app/entities/p-organization/service/p-organization.service';
import { InvoicePaymentModes } from 'app/entities/enumerations/invoice-payment-modes.model';
import { PaymentTypes } from 'app/entities/enumerations/payment-types.model';
import { InvoiceTypes } from 'app/entities/enumerations/invoice-types.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

@Component({
  selector: 'jhi-invoice-update',
  templateUrl: './invoice-update.component.html',
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;
  invoice: IInvoice | null = null;
  invoicePaymentModesValues = Object.keys(InvoicePaymentModes);
  paymentTypesValues = Object.keys(PaymentTypes);
  invoiceTypesValues = Object.keys(InvoiceTypes);
  invoicingStatusesValues = Object.keys(InvoicingStatuses);

  debtorsSharedCollection: IDebtor[] = [];
  clientsSharedCollection: IClient[] = [];
  pOrganizationsSharedCollection: IPOrganization[] = [];

  editForm: InvoiceFormGroup = this.invoiceFormService.createInvoiceFormGroup();

  constructor(
    protected invoiceService: InvoiceService,
    protected invoiceFormService: InvoiceFormService,
    protected debtorService: DebtorService,
    protected clientService: ClientService,
    protected pOrganizationService: POrganizationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDebtor = (o1: IDebtor | null, o2: IDebtor | null): boolean => this.debtorService.compareDebtor(o1, o2);

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  comparePOrganization = (o1: IPOrganization | null, o2: IPOrganization | null): boolean =>
    this.pOrganizationService.comparePOrganization(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
      if (invoice) {
        this.updateForm(invoice);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.invoiceFormService.getInvoice(this.editForm);
    if (invoice.id !== null) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>): void {
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

  protected updateForm(invoice: IInvoice): void {
    this.invoice = invoice;
    this.invoiceFormService.resetForm(this.editForm, invoice);

    this.debtorsSharedCollection = this.debtorService.addDebtorToCollectionIfMissing<IDebtor>(this.debtorsSharedCollection, invoice.debtor);
    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      invoice.invoiceToClient
    );
    this.pOrganizationsSharedCollection = this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(
      this.pOrganizationsSharedCollection,
      invoice.toOrganization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.debtorService
      .query()
      .pipe(map((res: HttpResponse<IDebtor[]>) => res.body ?? []))
      .pipe(map((debtors: IDebtor[]) => this.debtorService.addDebtorToCollectionIfMissing<IDebtor>(debtors, this.invoice?.debtor)))
      .subscribe((debtors: IDebtor[]) => (this.debtorsSharedCollection = debtors));

    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.invoice?.invoiceToClient)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.pOrganizationService
      .query()
      .pipe(map((res: HttpResponse<IPOrganization[]>) => res.body ?? []))
      .pipe(
        map((pOrganizations: IPOrganization[]) =>
          this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(pOrganizations, this.invoice?.toOrganization)
        )
      )
      .subscribe((pOrganizations: IPOrganization[]) => (this.pOrganizationsSharedCollection = pOrganizations));
  }
}
