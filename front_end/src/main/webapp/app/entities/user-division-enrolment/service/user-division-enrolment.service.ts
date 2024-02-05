import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDivisionEnrolment, NewUserDivisionEnrolment } from '../user-division-enrolment.model';

export type PartialUpdateUserDivisionEnrolment = Partial<IUserDivisionEnrolment> & Pick<IUserDivisionEnrolment, 'id'>;

type RestOf<T extends IUserDivisionEnrolment | NewUserDivisionEnrolment> = Omit<T, 'startedOn' | 'endedOn'> & {
  startedOn?: string | null;
  endedOn?: string | null;
};

export type RestUserDivisionEnrolment = RestOf<IUserDivisionEnrolment>;

export type NewRestUserDivisionEnrolment = RestOf<NewUserDivisionEnrolment>;

export type PartialUpdateRestUserDivisionEnrolment = RestOf<PartialUpdateUserDivisionEnrolment>;

export type EntityResponseType = HttpResponse<IUserDivisionEnrolment>;
export type EntityArrayResponseType = HttpResponse<IUserDivisionEnrolment[]>;

@Injectable({ providedIn: 'root' })
export class UserDivisionEnrolmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-division-enrolments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDivisionEnrolment: NewUserDivisionEnrolment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDivisionEnrolment);
    return this.http
      .post<RestUserDivisionEnrolment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userDivisionEnrolment: IUserDivisionEnrolment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDivisionEnrolment);
    return this.http
      .put<RestUserDivisionEnrolment>(`${this.resourceUrl}/${this.getUserDivisionEnrolmentIdentifier(userDivisionEnrolment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userDivisionEnrolment: PartialUpdateUserDivisionEnrolment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDivisionEnrolment);
    return this.http
      .patch<RestUserDivisionEnrolment>(`${this.resourceUrl}/${this.getUserDivisionEnrolmentIdentifier(userDivisionEnrolment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUserDivisionEnrolment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserDivisionEnrolment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserDivisionEnrolmentIdentifier(userDivisionEnrolment: Pick<IUserDivisionEnrolment, 'id'>): number {
    return userDivisionEnrolment.id;
  }

  compareUserDivisionEnrolment(o1: Pick<IUserDivisionEnrolment, 'id'> | null, o2: Pick<IUserDivisionEnrolment, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserDivisionEnrolmentIdentifier(o1) === this.getUserDivisionEnrolmentIdentifier(o2) : o1 === o2;
  }

  addUserDivisionEnrolmentToCollectionIfMissing<Type extends Pick<IUserDivisionEnrolment, 'id'>>(
    userDivisionEnrolmentCollection: Type[],
    ...userDivisionEnrolmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userDivisionEnrolments: Type[] = userDivisionEnrolmentsToCheck.filter(isPresent);
    if (userDivisionEnrolments.length > 0) {
      const userDivisionEnrolmentCollectionIdentifiers = userDivisionEnrolmentCollection.map(
        userDivisionEnrolmentItem => this.getUserDivisionEnrolmentIdentifier(userDivisionEnrolmentItem)!
      );
      const userDivisionEnrolmentsToAdd = userDivisionEnrolments.filter(userDivisionEnrolmentItem => {
        const userDivisionEnrolmentIdentifier = this.getUserDivisionEnrolmentIdentifier(userDivisionEnrolmentItem);
        if (userDivisionEnrolmentCollectionIdentifiers.includes(userDivisionEnrolmentIdentifier)) {
          return false;
        }
        userDivisionEnrolmentCollectionIdentifiers.push(userDivisionEnrolmentIdentifier);
        return true;
      });
      return [...userDivisionEnrolmentsToAdd, ...userDivisionEnrolmentCollection];
    }
    return userDivisionEnrolmentCollection;
  }

  protected convertDateFromClient<T extends IUserDivisionEnrolment | NewUserDivisionEnrolment | PartialUpdateUserDivisionEnrolment>(
    userDivisionEnrolment: T
  ): RestOf<T> {
    return {
      ...userDivisionEnrolment,
      startedOn: userDivisionEnrolment.startedOn?.toJSON() ?? null,
      endedOn: userDivisionEnrolment.endedOn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserDivisionEnrolment: RestUserDivisionEnrolment): IUserDivisionEnrolment {
    return {
      ...restUserDivisionEnrolment,
      startedOn: restUserDivisionEnrolment.startedOn ? dayjs(restUserDivisionEnrolment.startedOn) : undefined,
      endedOn: restUserDivisionEnrolment.endedOn ? dayjs(restUserDivisionEnrolment.endedOn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserDivisionEnrolment>): HttpResponse<IUserDivisionEnrolment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserDivisionEnrolment[]>): HttpResponse<IUserDivisionEnrolment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
