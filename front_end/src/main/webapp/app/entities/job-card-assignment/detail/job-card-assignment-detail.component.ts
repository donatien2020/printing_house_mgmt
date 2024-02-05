import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobCardAssignment } from '../job-card-assignment.model';

@Component({
  selector: 'jhi-job-card-assignment-detail',
  templateUrl: './job-card-assignment-detail.component.html',
})
export class JobCardAssignmentDetailComponent implements OnInit {
  jobCardAssignment: IJobCardAssignment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCardAssignment }) => {
      this.jobCardAssignment = jobCardAssignment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
