import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { POrganizationComponent } from './list/p-organization.component';
import { POrganizationDetailComponent } from './detail/p-organization-detail.component';
import { POrganizationUpdateComponent } from './update/p-organization-update.component';
import { POrganizationDeleteDialogComponent } from './delete/p-organization-delete-dialog.component';
import { POrganizationRoutingModule } from './route/p-organization-routing.module';

@NgModule({
  imports: [SharedModule, POrganizationRoutingModule],
  declarations: [POrganizationComponent, POrganizationDetailComponent, POrganizationUpdateComponent, POrganizationDeleteDialogComponent],
})
export class POrganizationModule {}
