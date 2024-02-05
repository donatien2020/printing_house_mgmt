import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EmployeeFormService, EmployeeFormGroup } from './employee-form.service';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { IDivision } from 'app/entities/division/division.model';
import { DivisionService } from 'app/entities/division/service/division.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { EmploymentStatuses } from 'app/entities/enumerations/employment-statuses.model';
import { EmploymentTypes } from 'app/entities/enumerations/employment-types.model';
import { PaymentPeriods } from 'app/entities/enumerations/payment-periods.model';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {
  isSaving = false;
  employee: IEmployee | null = null;
  employmentStatusesValues = Object.keys(EmploymentStatuses);
  employmentTypesValues = Object.keys(EmploymentTypes);
  paymentPeriodsValues = Object.keys(PaymentPeriods);

  divisionsSharedCollection: IDivision[] = [];
  peopleSharedCollection: IPerson[] = [];

  editForm: EmployeeFormGroup = this.employeeFormService.createEmployeeFormGroup();

  constructor(
    protected employeeService: EmployeeService,
    protected employeeFormService: EmployeeFormService,
    protected divisionService: DivisionService,
    protected personService: PersonService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDivision = (o1: IDivision | null, o2: IDivision | null): boolean => this.divisionService.compareDivision(o1, o2);

  comparePerson = (o1: IPerson | null, o2: IPerson | null): boolean => this.personService.comparePerson(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      if (employee) {
        this.updateForm(employee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employee = this.employeeFormService.getEmployee(this.editForm);
    if (employee.id !== null) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployee>>): void {
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

  protected updateForm(employee: IEmployee): void {
    this.employee = employee;
    this.employeeFormService.resetForm(this.editForm, employee);

    this.divisionsSharedCollection = this.divisionService.addDivisionToCollectionIfMissing<IDivision>(
      this.divisionsSharedCollection,
      employee.division
    );
    this.peopleSharedCollection = this.personService.addPersonToCollectionIfMissing<IPerson>(this.peopleSharedCollection, employee.person);
  }

  protected loadRelationshipsOptions(): void {
    this.divisionService
      .query()
      .pipe(map((res: HttpResponse<IDivision[]>) => res.body ?? []))
      .pipe(
        map((divisions: IDivision[]) =>
          this.divisionService.addDivisionToCollectionIfMissing<IDivision>(divisions, this.employee?.division)
        )
      )
      .subscribe((divisions: IDivision[]) => (this.divisionsSharedCollection = divisions));

    this.personService
      .query()
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing<IPerson>(people, this.employee?.person)))
      .subscribe((people: IPerson[]) => (this.peopleSharedCollection = people));
  }
}
