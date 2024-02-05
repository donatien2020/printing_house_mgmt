import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InvoiceItemComponent } from '../list/invoice-item.component';
import { InvoiceItemDetailComponent } from '../detail/invoice-item-detail.component';
import { InvoiceItemUpdateComponent } from '../update/invoice-item-update.component';
import { InvoiceItemRoutingResolveService } from './invoice-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const invoiceItemRoute: Routes = [
  {
    path: '',
    component: InvoiceItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvoiceItemDetailComponent,
    resolve: {
      invoiceItem: InvoiceItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvoiceItemUpdateComponent,
    resolve: {
      invoiceItem: InvoiceItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvoiceItemUpdateComponent,
    resolve: {
      invoiceItem: InvoiceItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(invoiceItemRoute)],
  exports: [RouterModule],
})
export class InvoiceItemRoutingModule {}
