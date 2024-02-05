import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinancialClientEngagement } from '../financial-client-engagement.model';
import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';

@Injectable({ providedIn: 'root' })
export class FinancialClientEngagementRoutingResolveService implements Resolve<IFinancialClientEngagement | null> {
  constructor(protected service: FinancialClientEngagementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinancialClientEngagement | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((financialClientEngagement: HttpResponse<IFinancialClientEngagement>) => {
          if (financialClientEngagement.body) {
            return of(financialClientEngagement.body);
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
