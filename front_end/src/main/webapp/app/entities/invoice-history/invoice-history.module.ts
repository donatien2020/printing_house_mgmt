import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InvoiceHistoryComponent } from './list/invoice-history.component';
import { InvoiceHistoryDetailComponent } from './detail/invoice-history-detail.component';
import { InvoiceHistoryUpdateComponent } from './update/invoice-history-update.component';
import { InvoiceHistoryDeleteDialogComponent } from './delete/invoice-history-delete-dialog.component';
import { InvoiceHistoryRoutingModule } from './route/invoice-history-routing.module';

@NgModule({
  imports: [SharedModule, InvoiceHistoryRoutingModule],
  declarations: [
    InvoiceHistoryComponent,
    InvoiceHistoryDetailComponent,
    InvoiceHistoryUpdateComponent,
    InvoiceHistoryDeleteDialogComponent,
  ],
})
export class InvoiceHistoryModule {}
