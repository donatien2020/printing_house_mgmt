import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReceipt } from '../receipt.model';
import { ReceiptService } from '../service/receipt.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './receipt-delete-dialog.component.html',
})
export class ReceiptDeleteDialogComponent {
  receipt?: IReceipt;

  constructor(protected receiptService: ReceiptService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.receiptService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
