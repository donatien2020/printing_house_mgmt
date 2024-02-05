import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocationLevel, NewLocationLevel } from '../location-level.model';

export type PartialUpdateLocationLevel = Partial<ILocationLevel> & Pick<ILocationLevel, 'id'>;

type RestOf<T extends ILocationLevel | NewLocationLevel> = Omit<T, 'createdOn' | 'updatedOn'> & {
  createdOn?: string | null;
  updatedOn?: string | null;
};

export type RestLocationLevel = RestOf<ILocationLevel>;

export type NewRestLocationLevel = RestOf<NewLocationLevel>;

export type PartialUpdateRestLocationLevel = RestOf<PartialUpdateLocationLevel>;

export type EntityResponseType = HttpResponse<ILocationLevel>;
export type EntityArrayResponseType = HttpResponse<ILocationLevel[]>;

@Injectable({ providedIn: 'root' })
export class LocationLevelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/location-levels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(locationLevel: NewLocationLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationLevel);
    return this.http
      .post<RestLocationLevel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(locationLevel: ILocationLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationLevel);
    return this.http
      .put<RestLocationLevel>(`${this.resourceUrl}/${this.getLocationLevelIdentifier(locationLevel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(locationLevel: PartialUpdateLocationLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationLevel);
    return this.http
      .patch<RestLocationLevel>(`${this.resourceUrl}/${this.getLocationLevelIdentifier(locationLevel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLocationLevel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLocationLevel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLocationLevelIdentifier(locationLevel: Pick<ILocationLevel, 'id'>): number {
    return locationLevel.id;
  }

  compareLocationLevel(o1: Pick<ILocationLevel, 'id'> | null, o2: Pick<ILocationLevel, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocationLevelIdentifier(o1) === this.getLocationLevelIdentifier(o2) : o1 === o2;
  }

  addLocationLevelToCollectionIfMissing<Type extends Pick<ILocationLevel, 'id'>>(
    locationLevelCollection: Type[],
    ...locationLevelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const locationLevels: Type[] = locationLevelsToCheck.filter(isPresent);
    if (locationLevels.length > 0) {
      const locationLevelCollectionIdentifiers = locationLevelCollection.map(
        locationLevelItem => this.getLocationLevelIdentifier(locationLevelItem)!
      );
      const locationLevelsToAdd = locationLevels.filter(locationLevelItem => {
        const locationLevelIdentifier = this.getLocationLevelIdentifier(locationLevelItem);
        if (locationLevelCollectionIdentifiers.includes(locationLevelIdentifier)) {
          return false;
        }
        locationLevelCollectionIdentifiers.push(locationLevelIdentifier);
        return true;
      });
      return [...locationLevelsToAdd, ...locationLevelCollection];
    }
    return locationLevelCollection;
  }

  protected convertDateFromClient<T extends ILocationLevel | NewLocationLevel | PartialUpdateLocationLevel>(locationLevel: T): RestOf<T> {
    return {
      ...locationLevel,
      createdOn: locationLevel.createdOn?.toJSON() ?? null,
      updatedOn: locationLevel.updatedOn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLocationLevel: RestLocationLevel): ILocationLevel {
    return {
      ...restLocationLevel,
      createdOn: restLocationLevel.createdOn ? dayjs(restLocationLevel.createdOn) : undefined,
      updatedOn: restLocationLevel.updatedOn ? dayjs(restLocationLevel.updatedOn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLocationLevel>): HttpResponse<ILocationLevel> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLocationLevel[]>): HttpResponse<ILocationLevel[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
