import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthoTracker } from '../autho-tracker.model';

@Component({
  selector: 'jhi-autho-tracker-detail',
  templateUrl: './autho-tracker-detail.component.html',
})
export class AuthoTrackerDetailComponent implements OnInit {
  authoTracker: IAuthoTracker | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authoTracker }) => {
      this.authoTracker = authoTracker;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
