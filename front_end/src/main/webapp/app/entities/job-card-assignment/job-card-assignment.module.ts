import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JobCardAssignmentComponent } from './list/job-card-assignment.component';
import { JobCardAssignmentDetailComponent } from './detail/job-card-assignment-detail.component';
import { JobCardAssignmentUpdateComponent } from './update/job-card-assignment-update.component';
import { JobCardAssignmentDeleteDialogComponent } from './delete/job-card-assignment-delete-dialog.component';
import { JobCardAssignmentRoutingModule } from './route/job-card-assignment-routing.module';

@NgModule({
  imports: [SharedModule, JobCardAssignmentRoutingModule],
  declarations: [
    JobCardAssignmentComponent,
    JobCardAssignmentDetailComponent,
    JobCardAssignmentUpdateComponent,
    JobCardAssignmentDeleteDialogComponent,
  ],
})
export class JobCardAssignmentModule {}
