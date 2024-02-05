import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthoTrackerFormService, AuthoTrackerFormGroup } from './autho-tracker-form.service';
import { IAuthoTracker } from '../autho-tracker.model';
import { AuthoTrackerService } from '../service/autho-tracker.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-autho-tracker-update',
  templateUrl: './autho-tracker-update.component.html',
})
export class AuthoTrackerUpdateComponent implements OnInit {
  isSaving = false;
  authoTracker: IAuthoTracker | null = null;
  statusValues = Object.keys(Status);

  editForm: AuthoTrackerFormGroup = this.authoTrackerFormService.createAuthoTrackerFormGroup();

  constructor(
    protected authoTrackerService: AuthoTrackerService,
    protected authoTrackerFormService: AuthoTrackerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authoTracker }) => {
      this.authoTracker = authoTracker;
      if (authoTracker) {
        this.updateForm(authoTracker);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const authoTracker = this.authoTrackerFormService.getAuthoTracker(this.editForm);
    if (authoTracker.id !== null) {
      this.subscribeToSaveResponse(this.authoTrackerService.update(authoTracker));
    } else {
      this.subscribeToSaveResponse(this.authoTrackerService.create(authoTracker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuthoTracker>>): void {
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

  protected updateForm(authoTracker: IAuthoTracker): void {
    this.authoTracker = authoTracker;
    this.authoTrackerFormService.resetForm(this.editForm, authoTracker);
  }
}
