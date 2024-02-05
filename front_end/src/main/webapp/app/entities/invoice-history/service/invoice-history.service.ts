import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvoiceHistory, NewInvoiceHistory } from '../invoice-history.model';

export type PartialUpdateInvoiceHistory = Partial<IInvoiceHistory> & Pick<IInvoiceHistory, 'id'>;

type RestOf<T extends IInvoiceHistory | NewInvoiceHistory> = Omit<T, 'doneOn'> & {
  doneOn?: string | null;
};

export type RestInvoiceHistory = RestOf<IInvoiceHistory>;

export type NewRestInvoiceHistory = RestOf<NewInvoiceHistory>;

export type PartialUpdateRestInvoiceHistory = RestOf<PartialUpdateInvoiceHistory>;

export type EntityResponseType = HttpResponse<IInvoiceHistory>;
export type EntityArrayResponseType = HttpResponse<IInvoiceHistory[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoice-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(invoiceHistory: NewInvoiceHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceHistory);
    return this.http
      .post<RestInvoiceHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(invoiceHistory: IInvoiceHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceHistory);
    return this.http
      .put<RestInvoiceHistory>(`${this.resourceUrl}/${this.getInvoiceHistoryIdentifier(invoiceHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(invoiceHistory: PartialUpdateInvoiceHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceHistory);
    return this.http
      .patch<RestInvoiceHistory>(`${this.resourceUrl}/${this.getInvoiceHistoryIdentifier(invoiceHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInvoiceHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvoiceHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvoiceHistoryIdentifier(invoiceHistory: Pick<IInvoiceHistory, 'id'>): number {
    return invoiceHistory.id;
  }

  compareInvoiceHistory(o1: Pick<IInvoiceHistory, 'id'> | null, o2: Pick<IInvoiceHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceHistoryIdentifier(o1) === this.getInvoiceHistoryIdentifier(o2) : o1 === o2;
  }

  addInvoiceHistoryToCollectionIfMissing<Type extends Pick<IInvoiceHistory, 'id'>>(
    invoiceHistoryCollection: Type[],
    ...invoiceHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoiceHistories: Type[] = invoiceHistoriesToCheck.filter(isPresent);
    if (invoiceHistories.length > 0) {
      const invoiceHistoryCollectionIdentifiers = invoiceHistoryCollection.map(
        invoiceHistoryItem => this.getInvoiceHistoryIdentifier(invoiceHistoryItem)!
      );
      const invoiceHistoriesToAdd = invoiceHistories.filter(invoiceHistoryItem => {
        const invoiceHistoryIdentifier = this.getInvoiceHistoryIdentifier(invoiceHistoryItem);
        if (invoiceHistoryCollectionIdentifiers.includes(invoiceHistoryIdentifier)) {
          return false;
        }
        invoiceHistoryCollectionIdentifiers.push(invoiceHistoryIdentifier);
        return true;
      });
      return [...invoiceHistoriesToAdd, ...invoiceHistoryCollection];
    }
    return invoiceHistoryCollection;
  }

  protected convertDateFromClient<T extends IInvoiceHistory | NewInvoiceHistory | PartialUpdateInvoiceHistory>(
    invoiceHistory: T
  ): RestOf<T> {
    return {
      ...invoiceHistory,
      doneOn: invoiceHistory.doneOn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInvoiceHistory: RestInvoiceHistory): IInvoiceHistory {
    return {
      ...restInvoiceHistory,
      doneOn: restInvoiceHistory.doneOn ? dayjs(restInvoiceHistory.doneOn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvoiceHistory>): HttpResponse<IInvoiceHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvoiceHistory[]>): HttpResponse<IInvoiceHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
