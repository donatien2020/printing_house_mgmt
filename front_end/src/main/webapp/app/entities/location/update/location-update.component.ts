import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LocationFormService, LocationFormGroup } from './location-form.service';
import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';
import { ILocationLevel } from 'app/entities/location-level/location-level.model';
import { LocationLevelService } from 'app/entities/location-level/service/location-level.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;
  location: ILocation | null = null;

  locationsSharedCollection: ILocation[] = [];
  locationLevelsSharedCollection: ILocationLevel[] = [];

  editForm: LocationFormGroup = this.locationFormService.createLocationFormGroup();

  constructor(
    protected locationService: LocationService,
    protected locationFormService: LocationFormService,
    protected locationLevelService: LocationLevelService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  compareLocationLevel = (o1: ILocationLevel | null, o2: ILocationLevel | null): boolean =>
    this.locationLevelService.compareLocationLevel(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
      if (location) {
        this.updateForm(location);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.locationFormService.getLocation(this.editForm);
    if (location.id !== null) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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

  protected updateForm(location: ILocation): void {
    this.location = location;
    this.locationFormService.resetForm(this.editForm, location);

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      location.parent
    );
    this.locationLevelsSharedCollection = this.locationLevelService.addLocationLevelToCollectionIfMissing<ILocationLevel>(
      this.locationLevelsSharedCollection,
      location.level
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) => this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.location?.parent))
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));

    this.locationLevelService
      .query()
      .pipe(map((res: HttpResponse<ILocationLevel[]>) => res.body ?? []))
      .pipe(
        map((locationLevels: ILocationLevel[]) =>
          this.locationLevelService.addLocationLevelToCollectionIfMissing<ILocationLevel>(locationLevels, this.location?.level)
        )
      )
      .subscribe((locationLevels: ILocationLevel[]) => (this.locationLevelsSharedCollection = locationLevels));
  }
}
