import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISupplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './supplier-delete-dialog.component.html',
})
export class SupplierDeleteDialogComponent {
  supplier?: ISupplier;

  constructor(protected supplierService: SupplierService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.supplierService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
