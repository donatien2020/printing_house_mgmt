import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPayRoll } from '../pay-roll.model';
import { PayRollService } from '../service/pay-roll.service';

@Injectable({ providedIn: 'root' })
export class PayRollRoutingResolveService implements Resolve<IPayRoll | null> {
  constructor(protected service: PayRollService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPayRoll | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((payRoll: HttpResponse<IPayRoll>) => {
          if (payRoll.body) {
            return of(payRoll.body);
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
