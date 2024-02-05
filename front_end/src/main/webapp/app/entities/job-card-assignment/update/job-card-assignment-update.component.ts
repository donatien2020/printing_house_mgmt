import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { JobCardAssignmentFormService, JobCardAssignmentFormGroup } from './job-card-assignment-form.service';
import { IJobCardAssignment } from '../job-card-assignment.model';
import { JobCardAssignmentService } from '../service/job-card-assignment.service';
import { IJobCard } from 'app/entities/job-card/job-card.model';
import { JobCardService } from 'app/entities/job-card/service/job-card.service';
import { JobCardAssignmentModes } from 'app/entities/enumerations/job-card-assignment-modes.model';
import { JobCardAssignmentStatuses } from 'app/entities/enumerations/job-card-assignment-statuses.model';

@Component({
  selector: 'jhi-job-card-assignment-update',
  templateUrl: './job-card-assignment-update.component.html',
})
export class JobCardAssignmentUpdateComponent implements OnInit {
  isSaving = false;
  jobCardAssignment: IJobCardAssignment | null = null;
  jobCardAssignmentModesValues = Object.keys(JobCardAssignmentModes);
  jobCardAssignmentStatusesValues = Object.keys(JobCardAssignmentStatuses);

  jobCardsSharedCollection: IJobCard[] = [];

  editForm: JobCardAssignmentFormGroup = this.jobCardAssignmentFormService.createJobCardAssignmentFormGroup();

  constructor(
    protected jobCardAssignmentService: JobCardAssignmentService,
    protected jobCardAssignmentFormService: JobCardAssignmentFormService,
    protected jobCardService: JobCardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareJobCard = (o1: IJobCard | null, o2: IJobCard | null): boolean => this.jobCardService.compareJobCard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCardAssignment }) => {
      this.jobCardAssignment = jobCardAssignment;
      if (jobCardAssignment) {
        this.updateForm(jobCardAssignment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobCardAssignment = this.jobCardAssignmentFormService.getJobCardAssignment(this.editForm);
    if (jobCardAssignment.id !== null) {
      this.subscribeToSaveResponse(this.jobCardAssignmentService.update(jobCardAssignment));
    } else {
      this.subscribeToSaveResponse(this.jobCardAssignmentService.create(jobCardAssignment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobCardAssignment>>): void {
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

  protected updateForm(jobCardAssignment: IJobCardAssignment): void {
    this.jobCardAssignment = jobCardAssignment;
    this.jobCardAssignmentFormService.resetForm(this.editForm, jobCardAssignment);

    this.jobCardsSharedCollection = this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(
      this.jobCardsSharedCollection,
      jobCardAssignment.jobCard
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobCardService
      .query()
      .pipe(map((res: HttpResponse<IJobCard[]>) => res.body ?? []))
      .pipe(
        map((jobCards: IJobCard[]) =>
          this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(jobCards, this.jobCardAssignment?.jobCard)
        )
      )
      .subscribe((jobCards: IJobCard[]) => (this.jobCardsSharedCollection = jobCards));
  }
}
