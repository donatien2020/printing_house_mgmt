import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthoTracker, NewAuthoTracker } from '../autho-tracker.model';

export type PartialUpdateAuthoTracker = Partial<IAuthoTracker> & Pick<IAuthoTracker, 'id'>;

type RestOf<T extends IAuthoTracker | NewAuthoTracker> = Omit<T, 'logedInOn'> & {
  logedInOn?: string | null;
};

export type RestAuthoTracker = RestOf<IAuthoTracker>;

export type NewRestAuthoTracker = RestOf<NewAuthoTracker>;

export type PartialUpdateRestAuthoTracker = RestOf<PartialUpdateAuthoTracker>;

export type EntityResponseType = HttpResponse<IAuthoTracker>;
export type EntityArrayResponseType = HttpResponse<IAuthoTracker[]>;

@Injectable({ providedIn: 'root' })
export class AuthoTrackerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/autho-trackers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(authoTracker: NewAuthoTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authoTracker);
    return this.http
      .post<RestAuthoTracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(authoTracker: IAuthoTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authoTracker);
    return this.http
      .put<RestAuthoTracker>(`${this.resourceUrl}/${this.getAuthoTrackerIdentifier(authoTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(authoTracker: PartialUpdateAuthoTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authoTracker);
    return this.http
      .patch<RestAuthoTracker>(`${this.resourceUrl}/${this.getAuthoTrackerIdentifier(authoTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAuthoTracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAuthoTracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAuthoTrackerIdentifier(authoTracker: Pick<IAuthoTracker, 'id'>): number {
    return authoTracker.id;
  }

  compareAuthoTracker(o1: Pick<IAuthoTracker, 'id'> | null, o2: Pick<IAuthoTracker, 'id'> | null): boolean {
    return o1 && o2 ? this.getAuthoTrackerIdentifier(o1) === this.getAuthoTrackerIdentifier(o2) : o1 === o2;
  }

  addAuthoTrackerToCollectionIfMissing<Type extends Pick<IAuthoTracker, 'id'>>(
    authoTrackerCollection: Type[],
    ...authoTrackersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const authoTrackers: Type[] = authoTrackersToCheck.filter(isPresent);
    if (authoTrackers.length > 0) {
      const authoTrackerCollectionIdentifiers = authoTrackerCollection.map(
        authoTrackerItem => this.getAuthoTrackerIdentifier(authoTrackerItem)!
      );
      const authoTrackersToAdd = authoTrackers.filter(authoTrackerItem => {
        const authoTrackerIdentifier = this.getAuthoTrackerIdentifier(authoTrackerItem);
        if (authoTrackerCollectionIdentifiers.includes(authoTrackerIdentifier)) {
          return false;
        }
        authoTrackerCollectionIdentifiers.push(authoTrackerIdentifier);
        return true;
      });
      return [...authoTrackersToAdd, ...authoTrackerCollection];
    }
    return authoTrackerCollection;
  }

  protected convertDateFromClient<T extends IAuthoTracker | NewAuthoTracker | PartialUpdateAuthoTracker>(authoTracker: T): RestOf<T> {
    return {
      ...authoTracker,
      logedInOn: authoTracker.logedInOn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAuthoTracker: RestAuthoTracker): IAuthoTracker {
    return {
      ...restAuthoTracker,
      logedInOn: restAuthoTracker.logedInOn ? dayjs(restAuthoTracker.logedInOn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAuthoTracker>): HttpResponse<IAuthoTracker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAuthoTracker[]>): HttpResponse<IAuthoTracker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
