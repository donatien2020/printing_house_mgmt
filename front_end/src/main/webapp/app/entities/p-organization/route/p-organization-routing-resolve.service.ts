import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPOrganization } from '../p-organization.model';
import { POrganizationService } from '../service/p-organization.service';

@Injectable({ providedIn: 'root' })
export class POrganizationRoutingResolveService implements Resolve<IPOrganization | null> {
  constructor(protected service: POrganizationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPOrganization | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pOrganization: HttpResponse<IPOrganization>) => {
          if (pOrganization.body) {
            return of(pOrganization.body);
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
