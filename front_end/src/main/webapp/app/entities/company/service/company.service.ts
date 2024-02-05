import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompany, NewCompany } from '../company.model';

export type PartialUpdateCompany = Partial<ICompany> & Pick<ICompany, 'id'>;

export type EntityResponseType = HttpResponse<ICompany>;
export type EntityArrayResponseType = HttpResponse<ICompany[]>;

@Injectable({ providedIn: 'root' })
export class CompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(company: NewCompany): Observable<EntityResponseType> {
    return this.http.post<ICompany>(this.resourceUrl, company, { observe: 'response' });
  }

  update(company: ICompany): Observable<EntityResponseType> {
    return this.http.put<ICompany>(`${this.resourceUrl}/${this.getCompanyIdentifier(company)}`, company, { observe: 'response' });
  }

  partialUpdate(company: PartialUpdateCompany): Observable<EntityResponseType> {
    return this.http.patch<ICompany>(`${this.resourceUrl}/${this.getCompanyIdentifier(company)}`, company, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyIdentifier(company: Pick<ICompany, 'id'>): number {
    return company.id;
  }

  compareCompany(o1: Pick<ICompany, 'id'> | null, o2: Pick<ICompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompanyIdentifier(o1) === this.getCompanyIdentifier(o2) : o1 === o2;
  }

  addCompanyToCollectionIfMissing<Type extends Pick<ICompany, 'id'>>(
    companyCollection: Type[],
    ...companiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companies: Type[] = companiesToCheck.filter(isPresent);
    if (companies.length > 0) {
      const companyCollectionIdentifiers = companyCollection.map(companyItem => this.getCompanyIdentifier(companyItem)!);
      const companiesToAdd = companies.filter(companyItem => {
        const companyIdentifier = this.getCompanyIdentifier(companyItem);
        if (companyCollectionIdentifiers.includes(companyIdentifier)) {
          return false;
        }
        companyCollectionIdentifiers.push(companyIdentifier);
        return true;
      });
      return [...companiesToAdd, ...companyCollection];
    }
    return companyCollection;
  }
}
