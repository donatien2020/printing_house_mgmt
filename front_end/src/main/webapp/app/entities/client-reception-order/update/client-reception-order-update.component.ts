import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ClientReceptionOrderFormService, ClientReceptionOrderFormGroup } from './client-reception-order-form.service';
import { IClientReceptionOrder } from '../client-reception-order.model';
import { ClientReceptionOrderService } from '../service/client-reception-order.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { ClientReceptionModes } from 'app/entities/enumerations/client-reception-modes.model';
import { OrderStatuses } from 'app/entities/enumerations/order-statuses.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

@Component({
  selector: 'jhi-client-reception-order-update',
  templateUrl: './client-reception-order-update.component.html',
})
export class ClientReceptionOrderUpdateComponent implements OnInit {
  isSaving = false;
  clientReceptionOrder: IClientReceptionOrder | null = null;
  clientReceptionModesValues = Object.keys(ClientReceptionModes);
  orderStatusesValues = Object.keys(OrderStatuses);
  invoicingStatusesValues = Object.keys(InvoicingStatuses);

  clientsSharedCollection: IClient[] = [];
  employeesSharedCollection: IEmployee[] = [];

  editForm: ClientReceptionOrderFormGroup = this.clientReceptionOrderFormService.createClientReceptionOrderFormGroup();

  constructor(
    protected clientReceptionOrderService: ClientReceptionOrderService,
    protected clientReceptionOrderFormService: ClientReceptionOrderFormService,
    protected clientService: ClientService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientReceptionOrder }) => {
      this.clientReceptionOrder = clientReceptionOrder;
      if (clientReceptionOrder) {
        this.updateForm(clientReceptionOrder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientReceptionOrder = this.clientReceptionOrderFormService.getClientReceptionOrder(this.editForm);
    if (clientReceptionOrder.id !== null) {
      this.subscribeToSaveResponse(this.clientReceptionOrderService.update(clientReceptionOrder));
    } else {
      this.subscribeToSaveResponse(this.clientReceptionOrderService.create(clientReceptionOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientReceptionOrder>>): void {
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

  protected updateForm(clientReceptionOrder: IClientReceptionOrder): void {
    this.clientReceptionOrder = clientReceptionOrder;
    this.clientReceptionOrderFormService.resetForm(this.editForm, clientReceptionOrder);

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      clientReceptionOrder.client
    );
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      clientReceptionOrder.assignedToEmployee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(
        map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.clientReceptionOrder?.client))
      )
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.clientReceptionOrder?.assignedToEmployee)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }
}
