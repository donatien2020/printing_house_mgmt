import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvoiceItem, NewInvoiceItem } from '../invoice-item.model';

export type PartialUpdateInvoiceItem = Partial<IInvoiceItem> & Pick<IInvoiceItem, 'id'>;

export type EntityResponseType = HttpResponse<IInvoiceItem>;
export type EntityArrayResponseType = HttpResponse<IInvoiceItem[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoice-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(invoiceItem: NewInvoiceItem): Observable<EntityResponseType> {
    return this.http.post<IInvoiceItem>(this.resourceUrl, invoiceItem, { observe: 'response' });
  }

  update(invoiceItem: IInvoiceItem): Observable<EntityResponseType> {
    return this.http.put<IInvoiceItem>(`${this.resourceUrl}/${this.getInvoiceItemIdentifier(invoiceItem)}`, invoiceItem, {
      observe: 'response',
    });
  }

  partialUpdate(invoiceItem: PartialUpdateInvoiceItem): Observable<EntityResponseType> {
    return this.http.patch<IInvoiceItem>(`${this.resourceUrl}/${this.getInvoiceItemIdentifier(invoiceItem)}`, invoiceItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInvoiceItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInvoiceItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvoiceItemIdentifier(invoiceItem: Pick<IInvoiceItem, 'id'>): number {
    return invoiceItem.id;
  }

  compareInvoiceItem(o1: Pick<IInvoiceItem, 'id'> | null, o2: Pick<IInvoiceItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceItemIdentifier(o1) === this.getInvoiceItemIdentifier(o2) : o1 === o2;
  }

  addInvoiceItemToCollectionIfMissing<Type extends Pick<IInvoiceItem, 'id'>>(
    invoiceItemCollection: Type[],
    ...invoiceItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoiceItems: Type[] = invoiceItemsToCheck.filter(isPresent);
    if (invoiceItems.length > 0) {
      const invoiceItemCollectionIdentifiers = invoiceItemCollection.map(
        invoiceItemItem => this.getInvoiceItemIdentifier(invoiceItemItem)!
      );
      const invoiceItemsToAdd = invoiceItems.filter(invoiceItemItem => {
        const invoiceItemIdentifier = this.getInvoiceItemIdentifier(invoiceItemItem);
        if (invoiceItemCollectionIdentifiers.includes(invoiceItemIdentifier)) {
          return false;
        }
        invoiceItemCollectionIdentifiers.push(invoiceItemIdentifier);
        return true;
      });
      return [...invoiceItemsToAdd, ...invoiceItemCollection];
    }
    return invoiceItemCollection;
  }
}
