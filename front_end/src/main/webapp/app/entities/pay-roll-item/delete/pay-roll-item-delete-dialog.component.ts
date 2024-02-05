import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayRollItem } from '../pay-roll-item.model';
import { PayRollItemService } from '../service/pay-roll-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pay-roll-item-delete-dialog.component.html',
})
export class PayRollItemDeleteDialogComponent {
  payRollItem?: IPayRollItem;

  constructor(protected payRollItemService: PayRollItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.payRollItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
