import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PayRollComponent } from './list/pay-roll.component';
import { PayRollDetailComponent } from './detail/pay-roll-detail.component';
import { PayRollUpdateComponent } from './update/pay-roll-update.component';
import { PayRollDeleteDialogComponent } from './delete/pay-roll-delete-dialog.component';
import { PayRollRoutingModule } from './route/pay-roll-routing.module';

@NgModule({
  imports: [SharedModule, PayRollRoutingModule],
  declarations: [PayRollComponent, PayRollDetailComponent, PayRollUpdateComponent, PayRollDeleteDialogComponent],
})
export class PayRollModule {}
