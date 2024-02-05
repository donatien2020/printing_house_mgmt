import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInvoiceHistory } from '../invoice-history.model';

@Component({
  selector: 'jhi-invoice-history-detail',
  templateUrl: './invoice-history-detail.component.html',
})
export class InvoiceHistoryDetailComponent implements OnInit {
  invoiceHistory: IInvoiceHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoiceHistory }) => {
      this.invoiceHistory = invoiceHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
