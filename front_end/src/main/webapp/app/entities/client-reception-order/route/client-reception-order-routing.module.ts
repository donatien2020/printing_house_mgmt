import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClientReceptionOrderComponent } from '../list/client-reception-order.component';
import { ClientReceptionOrderDetailComponent } from '../detail/client-reception-order-detail.component';
import { ClientReceptionOrderUpdateComponent } from '../update/client-reception-order-update.component';
import { ClientReceptionOrderRoutingResolveService } from './client-reception-order-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const clientReceptionOrderRoute: Routes = [
  {
    path: '',
    component: ClientReceptionOrderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientReceptionOrderDetailComponent,
    resolve: {
      clientReceptionOrder: ClientReceptionOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientReceptionOrderUpdateComponent,
    resolve: {
      clientReceptionOrder: ClientReceptionOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClientReceptionOrderUpdateComponent,
    resolve: {
      clientReceptionOrder: ClientReceptionOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientReceptionOrderRoute)],
  exports: [RouterModule],
})
export class ClientReceptionOrderRoutingModule {}
