import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobCardAssignmentComponent } from '../list/job-card-assignment.component';
import { JobCardAssignmentDetailComponent } from '../detail/job-card-assignment-detail.component';
import { JobCardAssignmentUpdateComponent } from '../update/job-card-assignment-update.component';
import { JobCardAssignmentRoutingResolveService } from './job-card-assignment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const jobCardAssignmentRoute: Routes = [
  {
    path: '',
    component: JobCardAssignmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobCardAssignmentDetailComponent,
    resolve: {
      jobCardAssignment: JobCardAssignmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobCardAssignmentUpdateComponent,
    resolve: {
      jobCardAssignment: JobCardAssignmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobCardAssignmentUpdateComponent,
    resolve: {
      jobCardAssignment: JobCardAssignmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobCardAssignmentRoute)],
  exports: [RouterModule],
})
export class JobCardAssignmentRoutingModule {}
