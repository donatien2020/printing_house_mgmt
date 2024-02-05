import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPOrganization } from '../p-organization.model';
import { POrganizationService } from '../service/p-organization.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './p-organization-delete-dialog.component.html',
})
export class POrganizationDeleteDialogComponent {
  pOrganization?: IPOrganization;

  constructor(protected pOrganizationService: POrganizationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pOrganizationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
