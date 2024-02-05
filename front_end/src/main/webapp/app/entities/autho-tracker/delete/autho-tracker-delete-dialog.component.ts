import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthoTracker } from '../autho-tracker.model';
import { AuthoTrackerService } from '../service/autho-tracker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './autho-tracker-delete-dialog.component.html',
})
export class AuthoTrackerDeleteDialogComponent {
  authoTracker?: IAuthoTracker;

  constructor(protected authoTrackerService: AuthoTrackerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authoTrackerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
