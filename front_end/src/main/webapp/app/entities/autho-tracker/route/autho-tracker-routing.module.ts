import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuthoTrackerComponent } from '../list/autho-tracker.component';
import { AuthoTrackerDetailComponent } from '../detail/autho-tracker-detail.component';
import { AuthoTrackerUpdateComponent } from '../update/autho-tracker-update.component';
import { AuthoTrackerRoutingResolveService } from './autho-tracker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const authoTrackerRoute: Routes = [
  {
    path: '',
    component: AuthoTrackerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthoTrackerDetailComponent,
    resolve: {
      authoTracker: AuthoTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthoTrackerUpdateComponent,
    resolve: {
      authoTracker: AuthoTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthoTrackerUpdateComponent,
    resolve: {
      authoTracker: AuthoTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authoTrackerRoute)],
  exports: [RouterModule],
})
export class AuthoTrackerRoutingModule {}
