import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PayRollItemComponent } from '../list/pay-roll-item.component';
import { PayRollItemDetailComponent } from '../detail/pay-roll-item-detail.component';
import { PayRollItemUpdateComponent } from '../update/pay-roll-item-update.component';
import { PayRollItemRoutingResolveService } from './pay-roll-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const payRollItemRoute: Routes = [
  {
    path: '',
    component: PayRollItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PayRollItemDetailComponent,
    resolve: {
      payRollItem: PayRollItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PayRollItemUpdateComponent,
    resolve: {
      payRollItem: PayRollItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PayRollItemUpdateComponent,
    resolve: {
      payRollItem: PayRollItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(payRollItemRoute)],
  exports: [RouterModule],
})
export class PayRollItemRoutingModule {}
