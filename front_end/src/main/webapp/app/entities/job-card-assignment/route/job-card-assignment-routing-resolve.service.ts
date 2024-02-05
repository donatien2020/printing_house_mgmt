import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobCardAssignment } from '../job-card-assignment.model';
import { JobCardAssignmentService } from '../service/job-card-assignment.service';

@Injectable({ providedIn: 'root' })
export class JobCardAssignmentRoutingResolveService implements Resolve<IJobCardAssignment | null> {
  constructor(protected service: JobCardAssignmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobCardAssignment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobCardAssignment: HttpResponse<IJobCardAssignment>) => {
          if (jobCardAssignment.body) {
            return of(jobCardAssignment.body);
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
