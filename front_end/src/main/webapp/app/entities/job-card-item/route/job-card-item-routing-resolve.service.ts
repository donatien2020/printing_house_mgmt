import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobCardItem } from '../job-card-item.model';
import { JobCardItemService } from '../service/job-card-item.service';

@Injectable({ providedIn: 'root' })
export class JobCardItemRoutingResolveService implements Resolve<IJobCardItem | null> {
  constructor(protected service: JobCardItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobCardItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobCardItem: HttpResponse<IJobCardItem>) => {
          if (jobCardItem.body) {
            return of(jobCardItem.body);
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
