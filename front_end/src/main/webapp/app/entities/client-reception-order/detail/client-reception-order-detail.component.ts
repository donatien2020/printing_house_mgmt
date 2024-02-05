import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClientReceptionOrder } from '../client-reception-order.model';

@Component({
  selector: 'jhi-client-reception-order-detail',
  templateUrl: './client-reception-order-detail.component.html',
})
export class ClientReceptionOrderDetailComponent implements OnInit {
  clientReceptionOrder: IClientReceptionOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientReceptionOrder }) => {
      this.clientReceptionOrder = clientReceptionOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
