import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobCardAssignment } from '../job-card-assignment.model';
import { JobCardAssignmentService } from '../service/job-card-assignment.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './job-card-assignment-delete-dialog.component.html',
})
export class JobCardAssignmentDeleteDialogComponent {
  jobCardAssignment?: IJobCardAssignment;

  constructor(protected jobCardAssignmentService: JobCardAssignmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobCardAssignmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
