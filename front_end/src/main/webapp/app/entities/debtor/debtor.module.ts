import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DebtorComponent } from './list/debtor.component';
import { DebtorDetailComponent } from './detail/debtor-detail.component';
import { DebtorUpdateComponent } from './update/debtor-update.component';
import { DebtorDeleteDialogComponent } from './delete/debtor-delete-dialog.component';
import { DebtorRoutingModule } from './route/debtor-routing.module';

@NgModule({
  imports: [SharedModule, DebtorRoutingModule],
  declarations: [DebtorComponent, DebtorDetailComponent, DebtorUpdateComponent, DebtorDeleteDialogComponent],
})
export class DebtorModule {}
