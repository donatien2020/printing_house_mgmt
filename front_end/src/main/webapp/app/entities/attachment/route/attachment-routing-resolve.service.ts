import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';

@Injectable({ providedIn: 'root' })
export class AttachmentRoutingResolveService implements Resolve<IAttachment | null> {
  constructor(protected service: AttachmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAttachment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((attachment: HttpResponse<IAttachment>) => {
          if (attachment.body) {
            return of(attachment.body);
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
