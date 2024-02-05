import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPayRoll } from '../pay-roll.model';

@Component({
  selector: 'jhi-pay-roll-detail',
  templateUrl: './pay-roll-detail.component.html',
})
export class PayRollDetailComponent implements OnInit {
  payRoll: IPayRoll | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payRoll }) => {
      this.payRoll = payRoll;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
