import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientReceptionOrder } from '../client-reception-order.model';
import { ClientReceptionOrderService } from '../service/client-reception-order.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './client-reception-order-delete-dialog.component.html',
})
export class ClientReceptionOrderDeleteDialogComponent {
  clientReceptionOrder?: IClientReceptionOrder;

  constructor(protected clientReceptionOrderService: ClientReceptionOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientReceptionOrderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
