import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JobCardItemComponent } from './list/job-card-item.component';
import { JobCardItemDetailComponent } from './detail/job-card-item-detail.component';
import { JobCardItemUpdateComponent } from './update/job-card-item-update.component';
import { JobCardItemDeleteDialogComponent } from './delete/job-card-item-delete-dialog.component';
import { JobCardItemRoutingModule } from './route/job-card-item-routing.module';

@NgModule({
  imports: [SharedModule, JobCardItemRoutingModule],
  declarations: [JobCardItemComponent, JobCardItemDetailComponent, JobCardItemUpdateComponent, JobCardItemDeleteDialogComponent],
})
export class JobCardItemModule {}
