import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClient, NewClient } from '../client.model';

export type PartialUpdateClient = Partial<IClient> & Pick<IClient, 'id'>;

export type EntityResponseType = HttpResponse<IClient>;
export type EntityArrayResponseType = HttpResponse<IClient[]>;

@Injectable({ providedIn: 'root' })
export class ClientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(client: NewClient): Observable<EntityResponseType> {
    return this.http.post<IClient>(this.resourceUrl, client, { observe: 'response' });
  }

  update(client: IClient): Observable<EntityResponseType> {
    return this.http.put<IClient>(`${this.resourceUrl}/${this.getClientIdentifier(client)}`, client, { observe: 'response' });
  }

  partialUpdate(client: PartialUpdateClient): Observable<EntityResponseType> {
    return this.http.patch<IClient>(`${this.resourceUrl}/${this.getClientIdentifier(client)}`, client, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientIdentifier(client: Pick<IClient, 'id'>): number {
    return client.id;
  }

  compareClient(o1: Pick<IClient, 'id'> | null, o2: Pick<IClient, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientIdentifier(o1) === this.getClientIdentifier(o2) : o1 === o2;
  }

  addClientToCollectionIfMissing<Type extends Pick<IClient, 'id'>>(
    clientCollection: Type[],
    ...clientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clients: Type[] = clientsToCheck.filter(isPresent);
    if (clients.length > 0) {
      const clientCollectionIdentifiers = clientCollection.map(clientItem => this.getClientIdentifier(clientItem)!);
      const clientsToAdd = clients.filter(clientItem => {
        const clientIdentifier = this.getClientIdentifier(clientItem);
        if (clientCollectionIdentifiers.includes(clientIdentifier)) {
          return false;
        }
        clientCollectionIdentifiers.push(clientIdentifier);
        return true;
      });
      return [...clientsToAdd, ...clientCollection];
    }
    return clientCollection;
  }
}
