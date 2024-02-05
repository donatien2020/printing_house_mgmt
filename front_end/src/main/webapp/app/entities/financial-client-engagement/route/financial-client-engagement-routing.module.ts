import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinancialClientEngagementComponent } from '../list/financial-client-engagement.component';
import { FinancialClientEngagementDetailComponent } from '../detail/financial-client-engagement-detail.component';
import { FinancialClientEngagementUpdateComponent } from '../update/financial-client-engagement-update.component';
import { FinancialClientEngagementRoutingResolveService } from './financial-client-engagement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const financialClientEngagementRoute: Routes = [
  {
    path: '',
    component: FinancialClientEngagementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinancialClientEngagementDetailComponent,
    resolve: {
      financialClientEngagement: FinancialClientEngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinancialClientEngagementUpdateComponent,
    resolve: {
      financialClientEngagement: FinancialClientEngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinancialClientEngagementUpdateComponent,
    resolve: {
      financialClientEngagement: FinancialClientEngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(financialClientEngagementRoute)],
  exports: [RouterModule],
})
export class FinancialClientEngagementRoutingModule {}
