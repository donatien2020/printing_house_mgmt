import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPayRollItem } from '../pay-roll-item.model';
import { PayRollItemService } from '../service/pay-roll-item.service';

@Injectable({ providedIn: 'root' })
export class PayRollItemRoutingResolveService implements Resolve<IPayRollItem | null> {
  constructor(protected service: PayRollItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPayRollItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((payRollItem: HttpResponse<IPayRollItem>) => {
          if (payRollItem.body) {
            return of(payRollItem.body);
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
