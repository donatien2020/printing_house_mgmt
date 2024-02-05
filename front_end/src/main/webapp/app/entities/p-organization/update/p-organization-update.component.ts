import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { POrganizationFormService, POrganizationFormGroup } from './p-organization-form.service';
import { IPOrganization } from '../p-organization.model';
import { POrganizationService } from '../service/p-organization.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { CompanyTypes } from 'app/entities/enumerations/company-types.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-p-organization-update',
  templateUrl: './p-organization-update.component.html',
})
export class POrganizationUpdateComponent implements OnInit {
  isSaving = false;
  pOrganization: IPOrganization | null = null;
  companyTypesValues = Object.keys(CompanyTypes);
  statusValues = Object.keys(Status);

  pOrganizationsSharedCollection: IPOrganization[] = [];
  companiesSharedCollection: ICompany[] = [];
  locationsSharedCollection: ILocation[] = [];

  editForm: POrganizationFormGroup = this.pOrganizationFormService.createPOrganizationFormGroup();

  constructor(
    protected pOrganizationService: POrganizationService,
    protected pOrganizationFormService: POrganizationFormService,
    protected companyService: CompanyService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePOrganization = (o1: IPOrganization | null, o2: IPOrganization | null): boolean =>
    this.pOrganizationService.comparePOrganization(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pOrganization }) => {
      this.pOrganization = pOrganization;
      if (pOrganization) {
        this.updateForm(pOrganization);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pOrganization = this.pOrganizationFormService.getPOrganization(this.editForm);
    if (pOrganization.id !== null) {
      this.subscribeToSaveResponse(this.pOrganizationService.update(pOrganization));
    } else {
      this.subscribeToSaveResponse(this.pOrganizationService.create(pOrganization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPOrganization>>): void {
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

  protected updateForm(pOrganization: IPOrganization): void {
    this.pOrganization = pOrganization;
    this.pOrganizationFormService.resetForm(this.editForm, pOrganization);

    this.pOrganizationsSharedCollection = this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(
      this.pOrganizationsSharedCollection,
      pOrganization.parent
    );
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      pOrganization.company
    );
    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      pOrganization.officeLocation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pOrganizationService
      .query()
      .pipe(map((res: HttpResponse<IPOrganization[]>) => res.body ?? []))
      .pipe(
        map((pOrganizations: IPOrganization[]) =>
          this.pOrganizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(pOrganizations, this.pOrganization?.parent)
        )
      ).subscribe((pOrganizations: IPOrganization[]) => (this.pOrganizationsSharedCollection = pOrganizations));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) =>
          this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.pOrganization?.company)
        )
      ).subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));

    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.pOrganization?.officeLocation)
        )
      ).subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }
}
