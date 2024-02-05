import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PayRollComponent } from '../list/pay-roll.component';
import { PayRollDetailComponent } from '../detail/pay-roll-detail.component';
import { PayRollUpdateComponent } from '../update/pay-roll-update.component';
import { PayRollRoutingResolveService } from './pay-roll-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const payRollRoute: Routes = [
  {
    path: '',
    component: PayRollComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PayRollDetailComponent,
    resolve: {
      payRoll: PayRollRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PayRollUpdateComponent,
    resolve: {
      payRoll: PayRollRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PayRollUpdateComponent,
    resolve: {
      payRoll: PayRollRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(payRollRoute)],
  exports: [RouterModule],
})
export class PayRollRoutingModule {}
