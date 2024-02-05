import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DeliveryComponent } from '../list/delivery.component';
import { DeliveryDetailComponent } from '../detail/delivery-detail.component';
import { DeliveryUpdateComponent } from '../update/delivery-update.component';
import { DeliveryRoutingResolveService } from './delivery-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const deliveryRoute: Routes = [
  {
    path: '',
    component: DeliveryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeliveryDetailComponent,
    resolve: {
      delivery: DeliveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeliveryUpdateComponent,
    resolve: {
      delivery: DeliveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeliveryUpdateComponent,
    resolve: {
      delivery: DeliveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(deliveryRoute)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}
