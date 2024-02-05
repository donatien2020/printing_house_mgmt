import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInvoiceHistory } from '../invoice-history.model';
import { InvoiceHistoryService } from '../service/invoice-history.service';

@Injectable({ providedIn: 'root' })
export class InvoiceHistoryRoutingResolveService implements Resolve<IInvoiceHistory | null> {
  constructor(protected service: InvoiceHistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInvoiceHistory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((invoiceHistory: HttpResponse<IInvoiceHistory>) => {
          if (invoiceHistory.body) {
            return of(invoiceHistory.body);
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
