import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientReceptionOrder, NewClientReceptionOrder } from '../client-reception-order.model';

export type PartialUpdateClientReceptionOrder = Partial<IClientReceptionOrder> & Pick<IClientReceptionOrder, 'id'>;

type RestOf<T extends IClientReceptionOrder | NewClientReceptionOrder> = Omit<T, 'receivedOn' | 'deliveryDate'> & {
  receivedOn?: string | null;
  deliveryDate?: string | null;
};

export type RestClientReceptionOrder = RestOf<IClientReceptionOrder>;

export type NewRestClientReceptionOrder = RestOf<NewClientReceptionOrder>;

export type PartialUpdateRestClientReceptionOrder = RestOf<PartialUpdateClientReceptionOrder>;

export type EntityResponseType = HttpResponse<IClientReceptionOrder>;
export type EntityArrayResponseType = HttpResponse<IClientReceptionOrder[]>;

@Injectable({ providedIn: 'root' })
export class ClientReceptionOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-reception-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clientReceptionOrder: NewClientReceptionOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientReceptionOrder);
    return this.http
      .post<RestClientReceptionOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clientReceptionOrder: IClientReceptionOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientReceptionOrder);
    return this.http
      .put<RestClientReceptionOrder>(`${this.resourceUrl}/${this.getClientReceptionOrderIdentifier(clientReceptionOrder)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clientReceptionOrder: PartialUpdateClientReceptionOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientReceptionOrder);
    return this.http
      .patch<RestClientReceptionOrder>(`${this.resourceUrl}/${this.getClientReceptionOrderIdentifier(clientReceptionOrder)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClientReceptionOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClientReceptionOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientReceptionOrderIdentifier(clientReceptionOrder: Pick<IClientReceptionOrder, 'id'>): number {
    return clientReceptionOrder.id;
  }

  compareClientReceptionOrder(o1: Pick<IClientReceptionOrder, 'id'> | null, o2: Pick<IClientReceptionOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientReceptionOrderIdentifier(o1) === this.getClientReceptionOrderIdentifier(o2) : o1 === o2;
  }

  addClientReceptionOrderToCollectionIfMissing<Type extends Pick<IClientReceptionOrder, 'id'>>(
    clientReceptionOrderCollection: Type[],
    ...clientReceptionOrdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientReceptionOrders: Type[] = clientReceptionOrdersToCheck.filter(isPresent);
    if (clientReceptionOrders.length > 0) {
      const clientReceptionOrderCollectionIdentifiers = clientReceptionOrderCollection.map(
        clientReceptionOrderItem => this.getClientReceptionOrderIdentifier(clientReceptionOrderItem)!
      );
      const clientReceptionOrdersToAdd = clientReceptionOrders.filter(clientReceptionOrderItem => {
        const clientReceptionOrderIdentifier = this.getClientReceptionOrderIdentifier(clientReceptionOrderItem);
        if (clientReceptionOrderCollectionIdentifiers.includes(clientReceptionOrderIdentifier)) {
          return false;
        }
        clientReceptionOrderCollectionIdentifiers.push(clientReceptionOrderIdentifier);
        return true;
      });
      return [...clientReceptionOrdersToAdd, ...clientReceptionOrderCollection];
    }
    return clientReceptionOrderCollection;
  }

  protected convertDateFromClient<T extends IClientReceptionOrder | NewClientReceptionOrder | PartialUpdateClientReceptionOrder>(
    clientReceptionOrder: T
  ): RestOf<T> {
    return {
      ...clientReceptionOrder,
      receivedOn: clientReceptionOrder.receivedOn?.toJSON() ?? null,
      deliveryDate: clientReceptionOrder.deliveryDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restClientReceptionOrder: RestClientReceptionOrder): IClientReceptionOrder {
    return {
      ...restClientReceptionOrder,
      receivedOn: restClientReceptionOrder.receivedOn ? dayjs(restClientReceptionOrder.receivedOn) : undefined,
      deliveryDate: restClientReceptionOrder.deliveryDate ? dayjs(restClientReceptionOrder.deliveryDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClientReceptionOrder>): HttpResponse<IClientReceptionOrder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClientReceptionOrder[]>): HttpResponse<IClientReceptionOrder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
