import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobCard } from '../job-card.model';
import { JobCardService } from '../service/job-card.service';

@Injectable({ providedIn: 'root' })
export class JobCardRoutingResolveService implements Resolve<IJobCard | null> {
  constructor(protected service: JobCardService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobCard | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobCard: HttpResponse<IJobCard>) => {
          if (jobCard.body) {
            return of(jobCard.body);
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
