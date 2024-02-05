import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPOrganization, NewPOrganization } from '../p-organization.model';

export type PartialUpdatePOrganization = Partial<IPOrganization> & Pick<IPOrganization, 'id'>;
export type EntityResponseType = HttpResponse<IPOrganization>;
export type EntityArrayResponseType = HttpResponse<IPOrganization[]>;

@Injectable({ providedIn: 'root' })
export class POrganizationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/p-organizations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pOrganization: NewPOrganization): Observable<EntityResponseType> {
    return this.http.post<IPOrganization>(this.resourceUrl, pOrganization, { observe: 'response' });
  }

  update(pOrganization: IPOrganization): Observable<EntityResponseType> {
    return this.http.put<IPOrganization>(`${this.resourceUrl}/${this.getPOrganizationIdentifier(pOrganization)}`, pOrganization, {
      observe: 'response',
    });
  }

  partialUpdate(pOrganization: PartialUpdatePOrganization): Observable<EntityResponseType> {
    return this.http.patch<IPOrganization>(`${this.resourceUrl}/${this.getPOrganizationIdentifier(pOrganization)}`, pOrganization, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPOrganization>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPOrganization[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPOrganizationIdentifier(pOrganization: Pick<IPOrganization, 'id'>): number {
    return pOrganization.id;
  }

  comparePOrganization(o1: Pick<IPOrganization, 'id'> | null, o2: Pick<IPOrganization, 'id'> | null): boolean {
    return o1 && o2 ? this.getPOrganizationIdentifier(o1) === this.getPOrganizationIdentifier(o2) : o1 === o2;
  }

  addPOrganizationToCollectionIfMissing<Type extends Pick<IPOrganization, 'id'>>(
    pOrganizationCollection: Type[],
    ...pOrganizationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pOrganizations: Type[] = pOrganizationsToCheck.filter(isPresent);
    if (pOrganizations.length > 0) {
      const pOrganizationCollectionIdentifiers = pOrganizationCollection.map(
        pOrganizationItem => this.getPOrganizationIdentifier(pOrganizationItem)!
      );
      const pOrganizationsToAdd = pOrganizations.filter(pOrganizationItem => {
        const pOrganizationIdentifier = this.getPOrganizationIdentifier(pOrganizationItem);
        if (pOrganizationCollectionIdentifiers.includes(pOrganizationIdentifier)) {
          return false;
        }
        pOrganizationCollectionIdentifiers.push(pOrganizationIdentifier);
        return true;
      });
      return [...pOrganizationsToAdd, ...pOrganizationCollection];
    }
    return pOrganizationCollection;
  }
}
