import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobCardItem, NewJobCardItem } from '../job-card-item.model';

export type PartialUpdateJobCardItem = Partial<IJobCardItem> & Pick<IJobCardItem, 'id'>;

export type EntityResponseType = HttpResponse<IJobCardItem>;
export type EntityArrayResponseType = HttpResponse<IJobCardItem[]>;

@Injectable({ providedIn: 'root' })
export class JobCardItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-card-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobCardItem: NewJobCardItem): Observable<EntityResponseType> {
    return this.http.post<IJobCardItem>(this.resourceUrl, jobCardItem, { observe: 'response' });
  }

  update(jobCardItem: IJobCardItem): Observable<EntityResponseType> {
    return this.http.put<IJobCardItem>(`${this.resourceUrl}/${this.getJobCardItemIdentifier(jobCardItem)}`, jobCardItem, {
      observe: 'response',
    });
  }

  partialUpdate(jobCardItem: PartialUpdateJobCardItem): Observable<EntityResponseType> {
    return this.http.patch<IJobCardItem>(`${this.resourceUrl}/${this.getJobCardItemIdentifier(jobCardItem)}`, jobCardItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobCardItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobCardItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJobCardItemIdentifier(jobCardItem: Pick<IJobCardItem, 'id'>): number {
    return jobCardItem.id;
  }

  compareJobCardItem(o1: Pick<IJobCardItem, 'id'> | null, o2: Pick<IJobCardItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobCardItemIdentifier(o1) === this.getJobCardItemIdentifier(o2) : o1 === o2;
  }

  addJobCardItemToCollectionIfMissing<Type extends Pick<IJobCardItem, 'id'>>(
    jobCardItemCollection: Type[],
    ...jobCardItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobCardItems: Type[] = jobCardItemsToCheck.filter(isPresent);
    if (jobCardItems.length > 0) {
      const jobCardItemCollectionIdentifiers = jobCardItemCollection.map(
        jobCardItemItem => this.getJobCardItemIdentifier(jobCardItemItem)!
      );
      const jobCardItemsToAdd = jobCardItems.filter(jobCardItemItem => {
        const jobCardItemIdentifier = this.getJobCardItemIdentifier(jobCardItemItem);
        if (jobCardItemCollectionIdentifiers.includes(jobCardItemIdentifier)) {
          return false;
        }
        jobCardItemCollectionIdentifiers.push(jobCardItemIdentifier);
        return true;
      });
      return [...jobCardItemsToAdd, ...jobCardItemCollection];
    }
    return jobCardItemCollection;
  }
}
