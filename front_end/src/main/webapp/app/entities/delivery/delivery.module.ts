import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DeliveryComponent } from './list/delivery.component';
import { DeliveryDetailComponent } from './detail/delivery-detail.component';
import { DeliveryUpdateComponent } from './update/delivery-update.component';
import { DeliveryDeleteDialogComponent } from './delete/delivery-delete-dialog.component';
import { DeliveryRoutingModule } from './route/delivery-routing.module';

@NgModule({
  imports: [SharedModule, DeliveryRoutingModule],
  declarations: [DeliveryComponent, DeliveryDetailComponent, DeliveryUpdateComponent, DeliveryDeleteDialogComponent],
})
export class DeliveryModule {}
