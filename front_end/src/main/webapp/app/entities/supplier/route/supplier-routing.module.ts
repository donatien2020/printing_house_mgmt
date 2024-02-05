import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SupplierComponent } from '../list/supplier.component';
import { SupplierDetailComponent } from '../detail/supplier-detail.component';
import { SupplierUpdateComponent } from '../update/supplier-update.component';
import { SupplierRoutingResolveService } from './supplier-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const supplierRoute: Routes = [
  {
    path: '',
    component: SupplierComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SupplierDetailComponent,
    resolve: {
      supplier: SupplierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SupplierUpdateComponent,
    resolve: {
      supplier: SupplierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SupplierUpdateComponent,
    resolve: {
      supplier: SupplierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(supplierRoute)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}
