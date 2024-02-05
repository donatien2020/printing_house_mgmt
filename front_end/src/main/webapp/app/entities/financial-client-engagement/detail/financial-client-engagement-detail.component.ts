import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinancialClientEngagement } from '../financial-client-engagement.model';

@Component({
  selector: 'jhi-financial-client-engagement-detail',
  templateUrl: './financial-client-engagement-detail.component.html',
})
export class FinancialClientEngagementDetailComponent implements OnInit {
  financialClientEngagement: IFinancialClientEngagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialClientEngagement }) => {
      this.financialClientEngagement = financialClientEngagement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
