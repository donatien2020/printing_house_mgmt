import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobCardItem } from '../job-card-item.model';

@Component({
  selector: 'jhi-job-card-item-detail',
  templateUrl: './job-card-item-detail.component.html',
})
export class JobCardItemDetailComponent implements OnInit {
  jobCardItem: IJobCardItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCardItem }) => {
      this.jobCardItem = jobCardItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
