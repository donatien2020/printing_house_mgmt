import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthoTrackerComponent } from './list/autho-tracker.component';
import { AuthoTrackerDetailComponent } from './detail/autho-tracker-detail.component';
import { AuthoTrackerUpdateComponent } from './update/autho-tracker-update.component';
import { AuthoTrackerDeleteDialogComponent } from './delete/autho-tracker-delete-dialog.component';
import { AuthoTrackerRoutingModule } from './route/autho-tracker-routing.module';

@NgModule({
  imports: [SharedModule, AuthoTrackerRoutingModule],
  declarations: [AuthoTrackerComponent, AuthoTrackerDetailComponent, AuthoTrackerUpdateComponent, AuthoTrackerDeleteDialogComponent],
})
export class AuthoTrackerModule {}
