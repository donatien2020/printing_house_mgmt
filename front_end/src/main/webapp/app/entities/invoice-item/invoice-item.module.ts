import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InvoiceItemComponent } from './list/invoice-item.component';
import { InvoiceItemDetailComponent } from './detail/invoice-item-detail.component';
import { InvoiceItemUpdateComponent } from './update/invoice-item-update.component';
import { InvoiceItemDeleteDialogComponent } from './delete/invoice-item-delete-dialog.component';
import { InvoiceItemRoutingModule } from './route/invoice-item-routing.module';

@NgModule({
  imports: [SharedModule, InvoiceItemRoutingModule],
  declarations: [InvoiceItemComponent, InvoiceItemDetailComponent, InvoiceItemUpdateComponent, InvoiceItemDeleteDialogComponent],
})
export class InvoiceItemModule {}
