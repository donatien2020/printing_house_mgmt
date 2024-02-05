import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocationLevel } from '../location-level.model';
import { LocationLevelService } from '../service/location-level.service';

@Injectable({ providedIn: 'root' })
export class LocationLevelRoutingResolveService implements Resolve<ILocationLevel | null> {
  constructor(protected service: LocationLevelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocationLevel | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((locationLevel: HttpResponse<ILocationLevel>) => {
          if (locationLevel.body) {
            return of(locationLevel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
