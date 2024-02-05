import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DivisionComponent } from '../list/division.component';
import { DivisionDetailComponent } from '../detail/division-detail.component';
import { DivisionUpdateComponent } from '../update/division-update.component';
import { DivisionRoutingResolveService } from './division-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const divisionRoute: Routes = [
  {
    path: '',
    component: DivisionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DivisionDetailComponent,
    resolve: {
      division: DivisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DivisionUpdateComponent,
    resolve: {
      division: DivisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DivisionUpdateComponent,
    resolve: {
      division: DivisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(divisionRoute)],
  exports: [RouterModule],
})
export class DivisionRoutingModule {}
