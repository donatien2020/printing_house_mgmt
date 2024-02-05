import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JobCardComponent } from './list/job-card.component';
import { JobCardDetailComponent } from './detail/job-card-detail.component';
import { JobCardUpdateComponent } from './update/job-card-update.component';
import { JobCardDeleteDialogComponent } from './delete/job-card-delete-dialog.component';
import { JobCardRoutingModule } from './route/job-card-routing.module';

@NgModule({
  imports: [SharedModule, JobCardRoutingModule],
  declarations: [JobCardComponent, JobCardDetailComponent, JobCardUpdateComponent, JobCardDeleteDialogComponent],
})
export class JobCardModule {}
