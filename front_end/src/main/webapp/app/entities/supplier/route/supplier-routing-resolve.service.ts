import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';

@Injectable({ providedIn: 'root' })
export class SupplierRoutingResolveService implements Resolve<ISupplier | null> {
  constructor(protected service: SupplierService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISupplier | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((supplier: HttpResponse<ISupplier>) => {
          if (supplier.body) {
            return of(supplier.body);
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
