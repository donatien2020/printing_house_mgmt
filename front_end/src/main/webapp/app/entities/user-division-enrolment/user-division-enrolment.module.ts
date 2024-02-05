import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserDivisionEnrolmentComponent } from './list/user-division-enrolment.component';
import { UserDivisionEnrolmentDetailComponent } from './detail/user-division-enrolment-detail.component';
import { UserDivisionEnrolmentUpdateComponent } from './update/user-division-enrolment-update.component';
import { UserDivisionEnrolmentDeleteDialogComponent } from './delete/user-division-enrolment-delete-dialog.component';
import { UserDivisionEnrolmentRoutingModule } from './route/user-division-enrolment-routing.module';

@NgModule({
  imports: [SharedModule, UserDivisionEnrolmentRoutingModule],
  declarations: [
    UserDivisionEnrolmentComponent,
    UserDivisionEnrolmentDetailComponent,
    UserDivisionEnrolmentUpdateComponent,
    UserDivisionEnrolmentDeleteDialogComponent,
  ],
})
export class UserDivisionEnrolmentModule {}
