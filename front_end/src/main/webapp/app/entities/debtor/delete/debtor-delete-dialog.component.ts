import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDebtor } from '../debtor.model';
import { DebtorService } from '../service/debtor.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './debtor-delete-dialog.component.html',
})
export class DebtorDeleteDialogComponent {
  debtor?: IDebtor;

  constructor(protected debtorService: DebtorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.debtorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
