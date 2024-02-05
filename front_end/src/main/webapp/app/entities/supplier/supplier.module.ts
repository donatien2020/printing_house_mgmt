import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SupplierComponent } from './list/supplier.component';
import { SupplierDetailComponent } from './detail/supplier-detail.component';
import { SupplierUpdateComponent } from './update/supplier-update.component';
import { SupplierDeleteDialogComponent } from './delete/supplier-delete-dialog.component';
import { SupplierRoutingModule } from './route/supplier-routing.module';

@NgModule({
  imports: [SharedModule, SupplierRoutingModule],
  declarations: [SupplierComponent, SupplierDetailComponent, SupplierUpdateComponent, SupplierDeleteDialogComponent],
})
export class SupplierModule {}
