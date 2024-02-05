import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDelivery } from '../delivery.model';
import { DeliveryService } from '../service/delivery.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './delivery-delete-dialog.component.html',
})
export class DeliveryDeleteDialogComponent {
  delivery?: IDelivery;

  constructor(protected deliveryService: DeliveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.deliveryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
