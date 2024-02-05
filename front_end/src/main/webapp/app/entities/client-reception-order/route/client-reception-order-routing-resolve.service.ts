import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientReceptionOrder } from '../client-reception-order.model';
import { ClientReceptionOrderService } from '../service/client-reception-order.service';

@Injectable({ providedIn: 'root' })
export class ClientReceptionOrderRoutingResolveService implements Resolve<IClientReceptionOrder | null> {
  constructor(protected service: ClientReceptionOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClientReceptionOrder | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clientReceptionOrder: HttpResponse<IClientReceptionOrder>) => {
          if (clientReceptionOrder.body) {
            return of(clientReceptionOrder.body);
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
