import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PayRollItemComponent } from './list/pay-roll-item.component';
import { PayRollItemDetailComponent } from './detail/pay-roll-item-detail.component';
import { PayRollItemUpdateComponent } from './update/pay-roll-item-update.component';
import { PayRollItemDeleteDialogComponent } from './delete/pay-roll-item-delete-dialog.component';
import { PayRollItemRoutingModule } from './route/pay-roll-item-routing.module';

@NgModule({
  imports: [SharedModule, PayRollItemRoutingModule],
  declarations: [PayRollItemComponent, PayRollItemDetailComponent, PayRollItemUpdateComponent, PayRollItemDeleteDialogComponent],
})
export class PayRollItemModule {}
