import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClientReceptionOrderComponent } from './list/client-reception-order.component';
import { ClientReceptionOrderDetailComponent } from './detail/client-reception-order-detail.component';
import { ClientReceptionOrderUpdateComponent } from './update/client-reception-order-update.component';
import { ClientReceptionOrderDeleteDialogComponent } from './delete/client-reception-order-delete-dialog.component';
import { ClientReceptionOrderRoutingModule } from './route/client-reception-order-routing.module';

@NgModule({
  imports: [SharedModule, ClientReceptionOrderRoutingModule],
  declarations: [
    ClientReceptionOrderComponent,
    ClientReceptionOrderDetailComponent,
    ClientReceptionOrderUpdateComponent,
    ClientReceptionOrderDeleteDialogComponent,
  ],
})
export class ClientReceptionOrderModule {}
