import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobCard } from '../job-card.model';

@Component({
  selector: 'jhi-job-card-detail',
  templateUrl: './job-card-detail.component.html',
})
export class JobCardDetailComponent implements OnInit {
  jobCard: IJobCard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCard }) => {
      this.jobCard = jobCard;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
