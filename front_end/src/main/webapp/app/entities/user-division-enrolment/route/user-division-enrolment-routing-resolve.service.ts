import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserDivisionEnrolment } from '../user-division-enrolment.model';
import { UserDivisionEnrolmentService } from '../service/user-division-enrolment.service';

@Injectable({ providedIn: 'root' })
export class UserDivisionEnrolmentRoutingResolveService implements Resolve<IUserDivisionEnrolment | null> {
  constructor(protected service: UserDivisionEnrolmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserDivisionEnrolment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userDivisionEnrolment: HttpResponse<IUserDivisionEnrolment>) => {
          if (userDivisionEnrolment.body) {
            return of(userDivisionEnrolment.body);
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
