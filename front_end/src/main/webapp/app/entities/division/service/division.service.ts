import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDivision, NewDivision } from '../division.model';

export type PartialUpdateDivision = Partial<IDivision> & Pick<IDivision, 'id'>;

export type EntityResponseType = HttpResponse<IDivision>;
export type EntityArrayResponseType = HttpResponse<IDivision[]>;

@Injectable({ providedIn: 'root' })
export class DivisionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/divisions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(division: NewDivision): Observable<EntityResponseType> {
    return this.http.post<IDivision>(this.resourceUrl, division, { observe: 'response' });
  }

  update(division: IDivision): Observable<EntityResponseType> {
    return this.http.put<IDivision>(`${this.resourceUrl}/${this.getDivisionIdentifier(division)}`, division, { observe: 'response' });
  }

  partialUpdate(division: PartialUpdateDivision): Observable<EntityResponseType> {
    return this.http.patch<IDivision>(`${this.resourceUrl}/${this.getDivisionIdentifier(division)}`, division, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDivision>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDivision[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDivisionIdentifier(division: Pick<IDivision, 'id'>): number {
    return division.id;
  }

  compareDivision(o1: Pick<IDivision, 'id'> | null, o2: Pick<IDivision, 'id'> | null): boolean {
    return o1 && o2 ? this.getDivisionIdentifier(o1) === this.getDivisionIdentifier(o2) : o1 === o2;
  }

  addDivisionToCollectionIfMissing<Type extends Pick<IDivision, 'id'>>(
    divisionCollection: Type[],
    ...divisionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const divisions: Type[] = divisionsToCheck.filter(isPresent);
    if (divisions.length > 0) {
      const divisionCollectionIdentifiers = divisionCollection.map(divisionItem => this.getDivisionIdentifier(divisionItem)!);
      const divisionsToAdd = divisions.filter(divisionItem => {
        const divisionIdentifier = this.getDivisionIdentifier(divisionItem);
        if (divisionCollectionIdentifiers.includes(divisionIdentifier)) {
          return false;
        }
        divisionCollectionIdentifiers.push(divisionIdentifier);
        return true;
      });
      return [...divisionsToAdd, ...divisionCollection];
    }
    return divisionCollection;
  }
}
