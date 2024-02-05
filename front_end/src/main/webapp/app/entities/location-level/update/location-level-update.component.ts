import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LocationLevelFormService, LocationLevelFormGroup } from './location-level-form.service';
import { ILocationLevel } from '../location-level.model';
import { LocationLevelService } from '../service/location-level.service';

@Component({
  selector: 'jhi-location-level-update',
  templateUrl: './location-level-update.component.html',
})
export class LocationLevelUpdateComponent implements OnInit {
  isSaving = false;
  locationLevel: ILocationLevel | null = null;

  editForm: LocationLevelFormGroup = this.locationLevelFormService.createLocationLevelFormGroup();

  constructor(
    protected locationLevelService: LocationLevelService,
    protected locationLevelFormService: LocationLevelFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationLevel }) => {
      this.locationLevel = locationLevel;
      if (locationLevel) {
        this.updateForm(locationLevel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const locationLevel = this.locationLevelFormService.getLocationLevel(this.editForm);
    if (locationLevel.id !== null) {
      this.subscribeToSaveResponse(this.locationLevelService.update(locationLevel));
    } else {
      this.subscribeToSaveResponse(this.locationLevelService.create(locationLevel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationLevel>>): void {
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

  protected updateForm(locationLevel: ILocationLevel): void {
    this.locationLevel = locationLevel;
    this.locationLevelFormService.resetForm(this.editForm, locationLevel);
  }
}
