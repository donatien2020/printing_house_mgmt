import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayRollItem, NewPayRollItem } from '../pay-roll-item.model';

export type PartialUpdatePayRollItem = Partial<IPayRollItem> & Pick<IPayRollItem, 'id'>;

type RestOf<T extends IPayRollItem | NewPayRollItem> = Omit<T, 'collectionDate' | 'computationDate'> & {
  collectionDate?: string | null;
  computationDate?: string | null;
};

export type RestPayRollItem = RestOf<IPayRollItem>;

export type NewRestPayRollItem = RestOf<NewPayRollItem>;

export type PartialUpdateRestPayRollItem = RestOf<PartialUpdatePayRollItem>;

export type EntityResponseType = HttpResponse<IPayRollItem>;
export type EntityArrayResponseType = HttpResponse<IPayRollItem[]>;

@Injectable({ providedIn: 'root' })
export class PayRollItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pay-roll-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(payRollItem: NewPayRollItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRollItem);
    return this.http
      .post<RestPayRollItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(payRollItem: IPayRollItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRollItem);
    return this.http
      .put<RestPayRollItem>(`${this.resourceUrl}/${this.getPayRollItemIdentifier(payRollItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(payRollItem: PartialUpdatePayRollItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payRollItem);
    return this.http
      .patch<RestPayRollItem>(`${this.resourceUrl}/${this.getPayRollItemIdentifier(payRollItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPayRollItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPayRollItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPayRollItemIdentifier(payRollItem: Pick<IPayRollItem, 'id'>): number {
    return payRollItem.id;
  }

  comparePayRollItem(o1: Pick<IPayRollItem, 'id'> | null, o2: Pick<IPayRollItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getPayRollItemIdentifier(o1) === this.getPayRollItemIdentifier(o2) : o1 === o2;
  }

  addPayRollItemToCollectionIfMissing<Type extends Pick<IPayRollItem, 'id'>>(
    payRollItemCollection: Type[],
    ...payRollItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const payRollItems: Type[] = payRollItemsToCheck.filter(isPresent);
    if (payRollItems.length > 0) {
      const payRollItemCollectionIdentifiers = payRollItemCollection.map(
        payRollItemItem => this.getPayRollItemIdentifier(payRollItemItem)!
      );
      const payRollItemsToAdd = payRollItems.filter(payRollItemItem => {
        const payRollItemIdentifier = this.getPayRollItemIdentifier(payRollItemItem);
        if (payRollItemCollectionIdentifiers.includes(payRollItemIdentifier)) {
          return false;
        }
        payRollItemCollectionIdentifiers.push(payRollItemIdentifier);
        return true;
      });
      return [...payRollItemsToAdd, ...payRollItemCollection];
    }
    return payRollItemCollection;
  }

  protected convertDateFromClient<T extends IPayRollItem | NewPayRollItem | PartialUpdatePayRollItem>(payRollItem: T): RestOf<T> {
    return {
      ...payRollItem,
      collectionDate: payRollItem.collectionDate?.toJSON() ?? null,
      computationDate: payRollItem.computationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPayRollItem: RestPayRollItem): IPayRollItem {
    return {
      ...restPayRollItem,
      collectionDate: restPayRollItem.collectionDate ? dayjs(restPayRollItem.collectionDate) : undefined,
      computationDate: restPayRollItem.computationDate ? dayjs(restPayRollItem.computationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPayRollItem>): HttpResponse<IPayRollItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPayRollItem[]>): HttpResponse<IPayRollItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
