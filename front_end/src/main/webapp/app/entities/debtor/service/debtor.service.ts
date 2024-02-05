import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDebtor, NewDebtor } from '../debtor.model';

export type PartialUpdateDebtor = Partial<IDebtor> & Pick<IDebtor, 'id'>;

type RestOf<T extends IDebtor | NewDebtor> = Omit<T, 'debtDate'> & {
  debtDate?: string | null;
};

export type RestDebtor = RestOf<IDebtor>;

export type NewRestDebtor = RestOf<NewDebtor>;

export type PartialUpdateRestDebtor = RestOf<PartialUpdateDebtor>;

export type EntityResponseType = HttpResponse<IDebtor>;
export type EntityArrayResponseType = HttpResponse<IDebtor[]>;

@Injectable({ providedIn: 'root' })
export class DebtorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/debtors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(debtor: NewDebtor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(debtor);
    return this.http
      .post<RestDebtor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(debtor: IDebtor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(debtor);
    return this.http
      .put<RestDebtor>(`${this.resourceUrl}/${this.getDebtorIdentifier(debtor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(debtor: PartialUpdateDebtor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(debtor);
    return this.http
      .patch<RestDebtor>(`${this.resourceUrl}/${this.getDebtorIdentifier(debtor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDebtor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDebtor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDebtorIdentifier(debtor: Pick<IDebtor, 'id'>): number {
    return debtor.id;
  }

  compareDebtor(o1: Pick<IDebtor, 'id'> | null, o2: Pick<IDebtor, 'id'> | null): boolean {
    return o1 && o2 ? this.getDebtorIdentifier(o1) === this.getDebtorIdentifier(o2) : o1 === o2;
  }

  addDebtorToCollectionIfMissing<Type extends Pick<IDebtor, 'id'>>(
    debtorCollection: Type[],
    ...debtorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const debtors: Type[] = debtorsToCheck.filter(isPresent);
    if (debtors.length > 0) {
      const debtorCollectionIdentifiers = debtorCollection.map(debtorItem => this.getDebtorIdentifier(debtorItem)!);
      const debtorsToAdd = debtors.filter(debtorItem => {
        const debtorIdentifier = this.getDebtorIdentifier(debtorItem);
        if (debtorCollectionIdentifiers.includes(debtorIdentifier)) {
          return false;
        }
        debtorCollectionIdentifiers.push(debtorIdentifier);
        return true;
      });
      return [...debtorsToAdd, ...debtorCollection];
    }
    return debtorCollection;
  }

  protected convertDateFromClient<T extends IDebtor | NewDebtor | PartialUpdateDebtor>(debtor: T): RestOf<T> {
    return {
      ...debtor,
      debtDate: debtor.debtDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDebtor: RestDebtor): IDebtor {
    return {
      ...restDebtor,
      debtDate: restDebtor.debtDate ? dayjs(restDebtor.debtDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDebtor>): HttpResponse<IDebtor> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDebtor[]>): HttpResponse<IDebtor[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
