import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobCardItemComponent } from '../list/job-card-item.component';
import { JobCardItemDetailComponent } from '../detail/job-card-item-detail.component';
import { JobCardItemUpdateComponent } from '../update/job-card-item-update.component';
import { JobCardItemRoutingResolveService } from './job-card-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const jobCardItemRoute: Routes = [
  {
    path: '',
    component: JobCardItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobCardItemDetailComponent,
    resolve: {
      jobCardItem: JobCardItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobCardItemUpdateComponent,
    resolve: {
      jobCardItem: JobCardItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobCardItemUpdateComponent,
    resolve: {
      jobCardItem: JobCardItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobCardItemRoute)],
  exports: [RouterModule],
})
export class JobCardItemRoutingModule {}
