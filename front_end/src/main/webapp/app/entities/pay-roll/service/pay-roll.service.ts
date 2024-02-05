import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayRoll, NewPayRoll } from '../pay-roll.model';

export type PartialUpdatePayRoll = Partial<IPayRoll> & Pick<IPayRoll, 'id'>;

type RestOf<T extends IPayRoll | NewPayRoll> = Omit<T, 'payFrom' | 'payTo'> & {
  payFrom?: string | null;
  payTo?: string | null;
};

export type RestPayRoll = RestOf<IPayRoll>;

export type NewRestPayRoll = RestOf<NewPayRoll>;

export type PartialUpdateRestPayRoll = RestOf<PartialUpdatePayRoll>;

export type EntityResponseType = HttpResponse<IPayRoll>;
export type EntityArrayResponseType = HttpResponse<IPayRoll[]>;

@Injectable({ providedIn: 'root' })
export class PayRollService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pay-rolls');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(payRoll: NewPayRoll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRoll);
    return this.http
      .post<RestPayRoll>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(payRoll: IPayRoll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRoll);
    return this.http
      .put<RestPayRoll>(`${this.resourceUrl}/${this.getPayRollIdentifier(payRoll)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(payRoll: PartialUpdatePayRoll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRoll);
    return this.http
      .patch<RestPayRoll>(`${this.resourceUrl}/${this.getPayRollIdentifier(payRoll)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPayRoll>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPayRoll[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPayRollIdentifier(payRoll: Pick<IPayRoll, 'id'>): number {
    return payRoll.id;
  }

  comparePayRoll(o1: Pick<IPayRoll, 'id'> | null, o2: Pick<IPayRoll, 'id'> | null): boolean {
    return o1 && o2 ? this.getPayRollIdentifier(o1) === this.getPayRollIdentifier(o2) : o1 === o2;
  }

  addPayRollToCollectionIfMissing<Type extends Pick<IPayRoll, 'id'>>(
    payRollCollection: Type[],
    ...payRollsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const payRolls: Type[] = payRollsToCheck.filter(isPresent);
    if (payRolls.length > 0) {
      const payRollCollectionIdentifiers = payRollCollection.map(payRollItem => this.getPayRollIdentifier(payRollItem)!);
      const payRollsToAdd = payRolls.filter(payRollItem => {
        const payRollIdentifier = this.getPayRollIdentifier(payRollItem);
        if (payRollCollectionIdentifiers.includes(payRollIdentifier)) {
          return false;
        }
        payRollCollectionIdentifiers.push(payRollIdentifier);
        return true;
      });
      return [...payRollsToAdd, ...payRollCollection];
    }
    return payRollCollection;
  }

  protected convertDateFromClient<T extends IPayRoll | NewPayRoll | PartialUpdatePayRoll>(payRoll: T): RestOf<T> {
    return {
      ...payRoll,
      payFrom: payRoll.payFrom?.format(DATE_FORMAT) ?? null,
      payTo: payRoll.payTo?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPayRoll: RestPayRoll): IPayRoll {
    return {
      ...restPayRoll,
      payFrom: restPayRoll.payFrom ? dayjs(restPayRoll.payFrom) : undefined,
      payTo: restPayRoll.payTo ? dayjs(restPayRoll.payTo) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPayRoll>): HttpResponse<IPayRoll> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPayRoll[]>): HttpResponse<IPayRoll[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
