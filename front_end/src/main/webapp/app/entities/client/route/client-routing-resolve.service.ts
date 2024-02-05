import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';

@Injectable({ providedIn: 'root' })
export class ClientRoutingResolveService implements Resolve<IClient | null> {
  constructor(protected service: ClientService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClient | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((client: HttpResponse<IClient>) => {
          if (client.body) {
            return of(client.body);
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
