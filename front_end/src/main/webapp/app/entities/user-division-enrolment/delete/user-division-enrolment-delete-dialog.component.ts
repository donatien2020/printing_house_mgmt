import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserDivisionEnrolment } from '../user-division-enrolment.model';
import { UserDivisionEnrolmentService } from '../service/user-division-enrolment.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-division-enrolment-delete-dialog.component.html',
})
export class UserDivisionEnrolmentDeleteDialogComponent {
  userDivisionEnrolment?: IUserDivisionEnrolment;

  constructor(protected userDivisionEnrolmentService: UserDivisionEnrolmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userDivisionEnrolmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
