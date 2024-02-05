import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AttachmentComponent } from '../list/attachment.component';
import { AttachmentDetailComponent } from '../detail/attachment-detail.component';
import { AttachmentUpdateComponent } from '../update/attachment-update.component';
import { AttachmentRoutingResolveService } from './attachment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const attachmentRoute: Routes = [
  {
    path: '',
    component: AttachmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttachmentDetailComponent,
    resolve: {
      attachment: AttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttachmentUpdateComponent,
    resolve: {
      attachment: AttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttachmentUpdateComponent,
    resolve: {
      attachment: AttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(attachmentRoute)],
  exports: [RouterModule],
})
export class AttachmentRoutingModule {}
