import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvoiceHistory } from '../invoice-history.model';
import { InvoiceHistoryService } from '../service/invoice-history.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './invoice-history-delete-dialog.component.html',
})
export class InvoiceHistoryDeleteDialogComponent {
  invoiceHistory?: IInvoiceHistory;

  constructor(protected invoiceHistoryService: InvoiceHistoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.invoiceHistoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
