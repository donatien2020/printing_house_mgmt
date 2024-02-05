import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinancialClientEngagementComponent } from './list/financial-client-engagement.component';
import { FinancialClientEngagementDetailComponent } from './detail/financial-client-engagement-detail.component';
import { FinancialClientEngagementUpdateComponent } from './update/financial-client-engagement-update.component';
import { FinancialClientEngagementDeleteDialogComponent } from './delete/financial-client-engagement-delete-dialog.component';
import { FinancialClientEngagementRoutingModule } from './route/financial-client-engagement-routing.module';

@NgModule({
  imports: [SharedModule, FinancialClientEngagementRoutingModule],
  declarations: [
    FinancialClientEngagementComponent,
    FinancialClientEngagementDetailComponent,
    FinancialClientEngagementUpdateComponent,
    FinancialClientEngagementDeleteDialogComponent,
  ],
})
export class FinancialClientEngagementModule {}
