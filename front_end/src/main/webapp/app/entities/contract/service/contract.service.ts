import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContract, NewContract } from '../contract.model';

export type PartialUpdateContract = Partial<IContract> & Pick<IContract, 'id'>;

type RestOf<T extends IContract | NewContract> = Omit<T, 'validFrom' | 'validTo'> & {
  validFrom?: string | null;
  validTo?: string | null;
};

export type RestContract = RestOf<IContract>;

export type NewRestContract = RestOf<NewContract>;

export type PartialUpdateRestContract = RestOf<PartialUpdateContract>;

export type EntityResponseType = HttpResponse<IContract>;
export type EntityArrayResponseType = HttpResponse<IContract[]>;

@Injectable({ providedIn: 'root' })
export class ContractService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contracts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contract: NewContract): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contract);
    return this.http
      .post<RestContract>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(contract: IContract): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contract);
    return this.http
      .put<RestContract>(`${this.resourceUrl}/${this.getContractIdentifier(contract)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(contract: PartialUpdateContract): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contract);
    return this.http
      .patch<RestContract>(`${this.resourceUrl}/${this.getContractIdentifier(contract)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestContract>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestContract[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getContractIdentifier(contract: Pick<IContract, 'id'>): number {
    return contract.id;
  }

  compareContract(o1: Pick<IContract, 'id'> | null, o2: Pick<IContract, 'id'> | null): boolean {
    return o1 && o2 ? this.getContractIdentifier(o1) === this.getContractIdentifier(o2) : o1 === o2;
  }

  addContractToCollectionIfMissing<Type extends Pick<IContract, 'id'>>(
    contractCollection: Type[],
    ...contractsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const contracts: Type[] = contractsToCheck.filter(isPresent);
    if (contracts.length > 0) {
      const contractCollectionIdentifiers = contractCollection.map(contractItem => this.getContractIdentifier(contractItem)!);
      const contractsToAdd = contracts.filter(contractItem => {
        const contractIdentifier = this.getContractIdentifier(contractItem);
        if (contractCollectionIdentifiers.includes(contractIdentifier)) {
          return false;
        }
        contractCollectionIdentifiers.push(contractIdentifier);
        return true;
      });
      return [...contractsToAdd, ...contractCollection];
    }
    return contractCollection;
  }

  protected convertDateFromClient<T extends IContract | NewContract | PartialUpdateContract>(contract: T): RestOf<T> {
    return {
      ...contract,
      validFrom: contract.validFrom?.toJSON() ?? null,
      validTo: contract.validTo?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restContract: RestContract): IContract {
    return {
      ...restContract,
      validFrom: restContract.validFrom ? dayjs(restContract.validFrom) : undefined,
      validTo: restContract.validTo ? dayjs(restContract.validTo) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestContract>): HttpResponse<IContract> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestContract[]>): HttpResponse<IContract[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
