import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InvoiceHistoryComponent } from '../list/invoice-history.component';
import { InvoiceHistoryDetailComponent } from '../detail/invoice-history-detail.component';
import { InvoiceHistoryUpdateComponent } from '../update/invoice-history-update.component';
import { InvoiceHistoryRoutingResolveService } from './invoice-history-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const invoiceHistoryRoute: Routes = [
  {
    path: '',
    component: InvoiceHistoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvoiceHistoryDetailComponent,
    resolve: {
      invoiceHistory: InvoiceHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvoiceHistoryUpdateComponent,
    resolve: {
      invoiceHistory: InvoiceHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvoiceHistoryUpdateComponent,
    resolve: {
      invoiceHistory: InvoiceHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(invoiceHistoryRoute)],
  exports: [RouterModule],
})
export class InvoiceHistoryRoutingModule {}
