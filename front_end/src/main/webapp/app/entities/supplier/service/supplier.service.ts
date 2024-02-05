import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISupplier, NewSupplier } from '../supplier.model';

export type PartialUpdateSupplier = Partial<ISupplier> & Pick<ISupplier, 'id'>;

export type EntityResponseType = HttpResponse<ISupplier>;
export type EntityArrayResponseType = HttpResponse<ISupplier[]>;

@Injectable({ providedIn: 'root' })
export class SupplierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/suppliers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(supplier: NewSupplier): Observable<EntityResponseType> {
    return this.http.post<ISupplier>(this.resourceUrl, supplier, { observe: 'response' });
  }

  update(supplier: ISupplier): Observable<EntityResponseType> {
    return this.http.put<ISupplier>(`${this.resourceUrl}/${this.getSupplierIdentifier(supplier)}`, supplier, { observe: 'response' });
  }

  partialUpdate(supplier: PartialUpdateSupplier): Observable<EntityResponseType> {
    return this.http.patch<ISupplier>(`${this.resourceUrl}/${this.getSupplierIdentifier(supplier)}`, supplier, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISupplier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISupplier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSupplierIdentifier(supplier: Pick<ISupplier, 'id'>): number {
    return supplier.id;
  }

  compareSupplier(o1: Pick<ISupplier, 'id'> | null, o2: Pick<ISupplier, 'id'> | null): boolean {
    return o1 && o2 ? this.getSupplierIdentifier(o1) === this.getSupplierIdentifier(o2) : o1 === o2;
  }

  addSupplierToCollectionIfMissing<Type extends Pick<ISupplier, 'id'>>(
    supplierCollection: Type[],
    ...suppliersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const suppliers: Type[] = suppliersToCheck.filter(isPresent);
    if (suppliers.length > 0) {
      const supplierCollectionIdentifiers = supplierCollection.map(supplierItem => this.getSupplierIdentifier(supplierItem)!);
      const suppliersToAdd = suppliers.filter(supplierItem => {
        const supplierIdentifier = this.getSupplierIdentifier(supplierItem);
        if (supplierCollectionIdentifiers.includes(supplierIdentifier)) {
          return false;
        }
        supplierCollectionIdentifiers.push(supplierIdentifier);
        return true;
      });
      return [...suppliersToAdd, ...supplierCollection];
    }
    return supplierCollection;
  }
}
