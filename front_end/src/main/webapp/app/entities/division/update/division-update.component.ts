import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DivisionFormService, DivisionFormGroup } from './division-form.service';
import { IDivision } from '../division.model';
import { DivisionService } from '../service/division.service';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { POrganizationService } from 'app/entities/p-organization/service/p-organization.service';
import { DivisionLevels } from 'app/entities/enumerations/division-levels.model';
import { DivisionTypes } from 'app/entities/enumerations/division-types.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-division-update',
  templateUrl: './division-update.component.html',
})
export class DivisionUpdateComponent implements OnInit {
  isSaving = false;
  division: IDivision | null = null;
  divisionLevelsValues = Object.keys(DivisionLevels);
  divisionTypesValues = Object.keys(DivisionTypes);
  statusValues = Object.keys(Status);

  divisionsSharedCollection: IDivision[] = [];
  pOrganizationsSharedCollection: IPOrganization[] = [];

  editForm: DivisionFormGroup = this.divisionFormService.createDivisionFormGroup();

  constructor(
    protected divisionService: DivisionService,
    protected divisionFormService: DivisionFormService,
    protected pOrganizationService: POrganizationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDivision = (o1: IDivision | null, o2: IDivision | null): boolean => this.divisionService.compareDivision(o1, o2);

  comparePOrganization = (o1: IPOrganization | null, o2: IPOrganization | null): boolean =>
    this.pOrganizationService.comparePOrganization(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ division }) => {
      this.division = division;
      if (division) {
        this.updateForm(division);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const division = this.divisionFormService.getDivision(this.editForm);
    if (division.id !== null) {
      this.subscribeToSaveResponse(this.divisionService.update(division));
    } else {
      this.subscribeToSaveResponse(this.divisionService.create(division));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDivision>>): void {
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

  protected updateForm(division: IDivision): void {
    this.division = division;
    this.divisionFormService.resetForm(this.editForm, division);

    this.divisionsSharedCollection = this.divisionService.addDivisionToCollectionIfMissing<IDivision>(
      this.divisionsSharedCollection,
      division.parent
    );
    this.pOrganizationsSharedCollection = this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(
      this.pOrganizationsSharedCollection,
      division.organization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.divisionService
      .query()
      .pipe(map((res: HttpResponse<IDivision[]>) => res.body ?? []))
      .pipe(
        map((divisions: IDivision[]) => this.divisionService.addDivisionToCollectionIfMissing<IDivision>(divisions, this.division?.parent))
      )
      .subscribe((divisions: IDivision[]) => (this.divisionsSharedCollection = divisions));

    this.pOrganizationService
      .query()
      .pipe(map((res: HttpResponse<IPOrganization[]>) => res.body ?? []))
      .pipe(
        map((pOrganizations: IPOrganization[]) =>
          this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(pOrganizations, this.division?.organization)
        )
      )
      .subscribe((pOrganizations: IPOrganization[]) => (this.pOrganizationsSharedCollection = pOrganizations));
  }
}
