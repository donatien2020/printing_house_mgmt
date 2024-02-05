import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DebtorComponent } from '../list/debtor.component';
import { DebtorDetailComponent } from '../detail/debtor-detail.component';
import { DebtorUpdateComponent } from '../update/debtor-update.component';
import { DebtorRoutingResolveService } from './debtor-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const debtorRoute: Routes = [
  {
    path: '',
    component: DebtorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DebtorDetailComponent,
    resolve: {
      debtor: DebtorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DebtorUpdateComponent,
    resolve: {
      debtor: DebtorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DebtorUpdateComponent,
    resolve: {
      debtor: DebtorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(debtorRoute)],
  exports: [RouterModule],
})
export class DebtorRoutingModule {}
