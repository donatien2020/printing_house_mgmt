import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDebtor } from '../debtor.model';
import { DebtorService } from '../service/debtor.service';

@Injectable({ providedIn: 'root' })
export class DebtorRoutingResolveService implements Resolve<IDebtor | null> {
  constructor(protected service: DebtorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDebtor | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((debtor: HttpResponse<IDebtor>) => {
          if (debtor.body) {
            return of(debtor.body);
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
