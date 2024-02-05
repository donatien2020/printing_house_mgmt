import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayRoll } from '../pay-roll.model';
import { PayRollService } from '../service/pay-roll.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pay-roll-delete-dialog.component.html',
})
export class PayRollDeleteDialogComponent {
  payRoll?: IPayRoll;

  constructor(protected payRollService: PayRollService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.payRollService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
