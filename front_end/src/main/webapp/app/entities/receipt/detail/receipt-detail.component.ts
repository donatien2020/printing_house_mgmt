import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReceipt } from '../receipt.model';

@Component({
  selector: 'jhi-receipt-detail',
  templateUrl: './receipt-detail.component.html',
})
export class ReceiptDetailComponent implements OnInit {
  receipt: IReceipt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receipt }) => {
      this.receipt = receipt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
