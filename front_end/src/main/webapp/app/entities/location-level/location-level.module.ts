import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LocationLevelComponent } from './list/location-level.component';
import { LocationLevelDetailComponent } from './detail/location-level-detail.component';
import { LocationLevelUpdateComponent } from './update/location-level-update.component';
import { LocationLevelDeleteDialogComponent } from './delete/location-level-delete-dialog.component';
import { LocationLevelRoutingModule } from './route/location-level-routing.module';

@NgModule({
  imports: [SharedModule, LocationLevelRoutingModule],
  declarations: [LocationLevelComponent, LocationLevelDetailComponent, LocationLevelUpdateComponent, LocationLevelDeleteDialogComponent],
})
export class LocationLevelModule {}
