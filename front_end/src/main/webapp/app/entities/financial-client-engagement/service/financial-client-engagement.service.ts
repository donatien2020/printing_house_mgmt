import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinancialClientEngagement, NewFinancialClientEngagement } from '../financial-client-engagement.model';

export type PartialUpdateFinancialClientEngagement = Partial<IFinancialClientEngagement> & Pick<IFinancialClientEngagement, 'id'>;

export type EntityResponseType = HttpResponse<IFinancialClientEngagement>;
export type EntityArrayResponseType = HttpResponse<IFinancialClientEngagement[]>;

@Injectable({ providedIn: 'root' })
export class FinancialClientEngagementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/financial-client-engagements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(financialClientEngagement: NewFinancialClientEngagement): Observable<EntityResponseType> {
    return this.http.post<IFinancialClientEngagement>(this.resourceUrl, financialClientEngagement, { observe: 'response' });
  }

  update(financialClientEngagement: IFinancialClientEngagement): Observable<EntityResponseType> {
    return this.http.put<IFinancialClientEngagement>(
      `${this.resourceUrl}/${this.getFinancialClientEngagementIdentifier(financialClientEngagement)}`,
      financialClientEngagement,
      { observe: 'response' }
    );
  }

  partialUpdate(financialClientEngagement: PartialUpdateFinancialClientEngagement): Observable<EntityResponseType> {
    return this.http.patch<IFinancialClientEngagement>(
      `${this.resourceUrl}/${this.getFinancialClientEngagementIdentifier(financialClientEngagement)}`,
      financialClientEngagement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFinancialClientEngagement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFinancialClientEngagement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFinancialClientEngagementIdentifier(financialClientEngagement: Pick<IFinancialClientEngagement, 'id'>): number {
    return financialClientEngagement.id;
  }

  compareFinancialClientEngagement(
    o1: Pick<IFinancialClientEngagement, 'id'> | null,
    o2: Pick<IFinancialClientEngagement, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getFinancialClientEngagementIdentifier(o1) === this.getFinancialClientEngagementIdentifier(o2) : o1 === o2;
  }

  addFinancialClientEngagementToCollectionIfMissing<Type extends Pick<IFinancialClientEngagement, 'id'>>(
    financialClientEngagementCollection: Type[],
    ...financialClientEngagementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const financialClientEngagements: Type[] = financialClientEngagementsToCheck.filter(isPresent);
    if (financialClientEngagements.length > 0) {
      const financialClientEngagementCollectionIdentifiers = financialClientEngagementCollection.map(
        financialClientEngagementItem => this.getFinancialClientEngagementIdentifier(financialClientEngagementItem)!
      );
      const financialClientEngagementsToAdd = financialClientEngagements.filter(financialClientEngagementItem => {
        const financialClientEngagementIdentifier = this.getFinancialClientEngagementIdentifier(financialClientEngagementItem);
        if (financialClientEngagementCollectionIdentifiers.includes(financialClientEngagementIdentifier)) {
          return false;
        }
        financialClientEngagementCollectionIdentifiers.push(financialClientEngagementIdentifier);
        return true;
      });
      return [...financialClientEngagementsToAdd, ...financialClientEngagementCollection];
    }
    return financialClientEngagementCollection;
  }
}
