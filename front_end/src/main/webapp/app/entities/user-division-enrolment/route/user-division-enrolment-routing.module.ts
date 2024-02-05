import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserDivisionEnrolmentComponent } from '../list/user-division-enrolment.component';
import { UserDivisionEnrolmentDetailComponent } from '../detail/user-division-enrolment-detail.component';
import { UserDivisionEnrolmentUpdateComponent } from '../update/user-division-enrolment-update.component';
import { UserDivisionEnrolmentRoutingResolveService } from './user-division-enrolment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userDivisionEnrolmentRoute: Routes = [
  {
    path: '',
    component: UserDivisionEnrolmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserDivisionEnrolmentDetailComponent,
    resolve: {
      userDivisionEnrolment: UserDivisionEnrolmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserDivisionEnrolmentUpdateComponent,
    resolve: {
      userDivisionEnrolment: UserDivisionEnrolmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserDivisionEnrolmentUpdateComponent,
    resolve: {
      userDivisionEnrolment: UserDivisionEnrolmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userDivisionEnrolmentRoute)],
  exports: [RouterModule],
})
export class UserDivisionEnrolmentRoutingModule {}
