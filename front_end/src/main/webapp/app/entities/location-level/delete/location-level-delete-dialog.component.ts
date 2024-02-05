import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationLevel } from '../location-level.model';
import { LocationLevelService } from '../service/location-level.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './location-level-delete-dialog.component.html',
})
export class LocationLevelDeleteDialogComponent {
  locationLevel?: ILocationLevel;

  constructor(protected locationLevelService: LocationLevelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationLevelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
