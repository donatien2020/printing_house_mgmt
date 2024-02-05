import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ContractFormService, ContractFormGroup } from './contract-form.service';
import { IContract } from '../contract.model';
import { ContractService } from '../service/contract.service';
import { ContractTypes } from 'app/entities/enumerations/contract-types.model';
import { Status } from 'app/entities/enumerations/status.model';
import { ContractOwnerTypes } from 'app/entities/enumerations/contract-owner-types.model';
import { ContractAcquiringStatuses } from 'app/entities/enumerations/contract-acquiring-statuses.model';

@Component({
  selector: 'jhi-contract-update',
  templateUrl: './contract-update.component.html',
})
export class ContractUpdateComponent implements OnInit {
  isSaving = false;
  contract: IContract | null = null;
  contractTypesValues = Object.keys(ContractTypes);
  statusValues = Object.keys(Status);
  contractOwnerTypesValues = Object.keys(ContractOwnerTypes);
  contractAcquiringStatusesValues = Object.keys(ContractAcquiringStatuses);

  editForm: ContractFormGroup = this.contractFormService.createContractFormGroup();

  constructor(
    protected contractService: ContractService,
    protected contractFormService: ContractFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contract }) => {
      this.contract = contract;
      if (contract) {
        this.updateForm(contract);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contract = this.contractFormService.getContract(this.editForm);
    if (contract.id !== null) {
      this.subscribeToSaveResponse(this.contractService.update(contract));
    } else {
      this.subscribeToSaveResponse(this.contractService.create(contract));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContract>>): void {
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

  protected updateForm(contract: IContract): void {
    this.contract = contract;
    this.contractFormService.resetForm(this.editForm, contract);
  }
}
