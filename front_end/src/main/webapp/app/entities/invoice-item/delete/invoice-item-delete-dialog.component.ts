import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvoiceItem } from '../invoice-item.model';
import { InvoiceItemService } from '../service/invoice-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './invoice-item-delete-dialog.component.html',
})
export class InvoiceItemDeleteDialogComponent {
  invoiceItem?: IInvoiceItem;

  constructor(protected invoiceItemService: InvoiceItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.invoiceItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
