import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDelivery } from '../delivery.model';

@Component({
  selector: 'jhi-delivery-detail',
  templateUrl: './delivery-detail.component.html',
})
export class DeliveryDetailComponent implements OnInit {
  delivery: IDelivery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ delivery }) => {
      this.delivery = delivery;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
