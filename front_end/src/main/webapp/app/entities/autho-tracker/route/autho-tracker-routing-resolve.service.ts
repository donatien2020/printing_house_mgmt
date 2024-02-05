import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuthoTracker } from '../autho-tracker.model';
import { AuthoTrackerService } from '../service/autho-tracker.service';

@Injectable({ providedIn: 'root' })
export class AuthoTrackerRoutingResolveService implements Resolve<IAuthoTracker | null> {
  constructor(protected service: AuthoTrackerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuthoTracker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((authoTracker: HttpResponse<IAuthoTracker>) => {
          if (authoTracker.body) {
            return of(authoTracker.body);
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
