import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinancialClientEngagement } from '../financial-client-engagement.model';
import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './financial-client-engagement-delete-dialog.component.html',
})
export class FinancialClientEngagementDeleteDialogComponent {
  financialClientEngagement?: IFinancialClientEngagement;

  constructor(protected financialClientEngagementService: FinancialClientEngagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.financialClientEngagementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
