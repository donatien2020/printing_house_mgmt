import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { POrganizationComponent } from '../list/p-organization.component';
import { POrganizationDetailComponent } from '../detail/p-organization-detail.component';
import { POrganizationUpdateComponent } from '../update/p-organization-update.component';
import { POrganizationRoutingResolveService } from './p-organization-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pOrganizationRoute: Routes = [
  {
    path: '',
    component: POrganizationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: POrganizationDetailComponent,
    resolve: {
      pOrganization: POrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: POrganizationUpdateComponent,
    resolve: {
      pOrganization: POrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: POrganizationUpdateComponent,
    resolve: {
      pOrganization: POrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pOrganizationRoute)],
  exports: [RouterModule],
})
export class POrganizationRoutingModule {}
