import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PersonComponent } from '../list/person.component';
import { PersonDetailComponent } from '../detail/person-detail.component';
import { PersonUpdateComponent } from '../update/person-update.component';
import { PersonRoutingResolveService } from './person-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const personRoute: Routes = [
  {
    path: '',
    component: PersonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonDetailComponent,
    resolve: {
      person: PersonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonUpdateComponent,
    resolve: {
      person: PersonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonUpdateComponent,
    resolve: {
      person: PersonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(personRoute)],
  exports: [RouterModule],
})
export class PersonRoutingModule {}
