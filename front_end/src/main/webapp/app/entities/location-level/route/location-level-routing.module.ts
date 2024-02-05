import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LocationLevelComponent } from '../list/location-level.component';
import { LocationLevelDetailComponent } from '../detail/location-level-detail.component';
import { LocationLevelUpdateComponent } from '../update/location-level-update.component';
import { LocationLevelRoutingResolveService } from './location-level-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const locationLevelRoute: Routes = [
  {
    path: '',
    component: LocationLevelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationLevelDetailComponent,
    resolve: {
      locationLevel: LocationLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationLevelUpdateComponent,
    resolve: {
      locationLevel: LocationLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationLevelUpdateComponent,
    resolve: {
      locationLevel: LocationLevelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(locationLevelRoute)],
  exports: [RouterModule],
})
export class LocationLevelRoutingModule {}
