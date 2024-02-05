import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReceiptComponent } from '../list/receipt.component';
import { ReceiptDetailComponent } from '../detail/receipt-detail.component';
import { ReceiptUpdateComponent } from '../update/receipt-update.component';
import { ReceiptRoutingResolveService } from './receipt-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const receiptRoute: Routes = [
  {
    path: '',
    component: ReceiptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReceiptDetailComponent,
    resolve: {
      receipt: ReceiptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReceiptUpdateComponent,
    resolve: {
      receipt: ReceiptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReceiptUpdateComponent,
    resolve: {
      receipt: ReceiptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(receiptRoute)],
  exports: [RouterModule],
})
export class ReceiptRoutingModule {}
