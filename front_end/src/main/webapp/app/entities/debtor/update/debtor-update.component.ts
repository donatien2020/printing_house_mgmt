import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DebtorFormService, DebtorFormGroup } from './debtor-form.service';
import { IDebtor } from '../debtor.model';
import { DebtorService } from '../service/debtor.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { DebtStatuses } from 'app/entities/enumerations/debt-statuses.model';
import { DebtInvoicingStatuses } from 'app/entities/enumerations/debt-invoicing-statuses.model';

@Component({
  selector: 'jhi-debtor-update',
  templateUrl: './debtor-update.component.html',
})
export class DebtorUpdateComponent implements OnInit {
  isSaving = false;
  debtor: IDebtor | null = null;
  debtStatusesValues = Object.keys(DebtStatuses);
  debtInvoicingStatusesValues = Object.keys(DebtInvoicingStatuses);

  suppliersSharedCollection: ISupplier[] = [];

  editForm: DebtorFormGroup = this.debtorFormService.createDebtorFormGroup();

  constructor(
    protected debtorService: DebtorService,
    protected debtorFormService: DebtorFormService,
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ debtor }) => {
      this.debtor = debtor;
      if (debtor) {
        this.updateForm(debtor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const debtor = this.debtorFormService.getDebtor(this.editForm);
    if (debtor.id !== null) {
      this.subscribeToSaveResponse(this.debtorService.update(debtor));
    } else {
      this.subscribeToSaveResponse(this.debtorService.create(debtor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDebtor>>): void {
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

  protected updateForm(debtor: IDebtor): void {
    this.debtor = debtor;
    this.debtorFormService.resetForm(this.editForm, debtor);

    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      debtor.supplier
    );
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) => this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.debtor?.supplier))
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));
  }
}
