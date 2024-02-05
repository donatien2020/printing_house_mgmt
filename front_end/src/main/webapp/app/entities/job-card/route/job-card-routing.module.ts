import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobCardComponent } from '../list/job-card.component';
import { JobCardDetailComponent } from '../detail/job-card-detail.component';
import { JobCardUpdateComponent } from '../update/job-card-update.component';
import { JobCardRoutingResolveService } from './job-card-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const jobCardRoute: Routes = [
  {
    path: '',
    component: JobCardComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobCardDetailComponent,
    resolve: {
      jobCard: JobCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobCardUpdateComponent,
    resolve: {
      jobCard: JobCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobCardUpdateComponent,
    resolve: {
      jobCard: JobCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobCardRoute)],
  exports: [RouterModule],
})
export class JobCardRoutingModule {}
