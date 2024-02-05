import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobCardItem } from '../job-card-item.model';
import { JobCardItemService } from '../service/job-card-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './job-card-item-delete-dialog.component.html',
})
export class JobCardItemDeleteDialogComponent {
  jobCardItem?: IJobCardItem;

  constructor(protected jobCardItemService: JobCardItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobCardItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
