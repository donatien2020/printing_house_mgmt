import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPayRollItem } from '../pay-roll-item.model';

@Component({
  selector: 'jhi-pay-roll-item-detail',
  templateUrl: './pay-roll-item-detail.component.html',
})
export class PayRollItemDetailComponent implements OnInit {
  payRollItem: IPayRollItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payRollItem }) => {
      this.payRollItem = payRollItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
