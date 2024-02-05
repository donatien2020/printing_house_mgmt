import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobCard, NewJobCard } from '../job-card.model';

export type PartialUpdateJobCard = Partial<IJobCard> & Pick<IJobCard, 'id'>;

type RestOf<T extends IJobCard | NewJobCard> = Omit<T, 'startedOn' | 'completedOn'> & {
  startedOn?: string | null;
  completedOn?: string | null;
};

export type RestJobCard = RestOf<IJobCard>;

export type NewRestJobCard = RestOf<NewJobCard>;

export type PartialUpdateRestJobCard = RestOf<PartialUpdateJobCard>;

export type EntityResponseType = HttpResponse<IJobCard>;
export type EntityArrayResponseType = HttpResponse<IJobCard[]>;

@Injectable({ providedIn: 'root' })
export class JobCardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-cards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobCard: NewJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .post<RestJobCard>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobCard: IJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .put<RestJobCard>(`${this.resourceUrl}/${this.getJobCardIdentifier(jobCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobCard: PartialUpdateJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .patch<RestJobCard>(`${this.resourceUrl}/${this.getJobCardIdentifier(jobCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobCard>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobCard[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJobCardIdentifier(jobCard: Pick<IJobCard, 'id'>): number {
    return jobCard.id;
  }

  compareJobCard(o1: Pick<IJobCard, 'id'> | null, o2: Pick<IJobCard, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobCardIdentifier(o1) === this.getJobCardIdentifier(o2) : o1 === o2;
  }

  addJobCardToCollectionIfMissing<Type extends Pick<IJobCard, 'id'>>(
    jobCardCollection: Type[],
    ...jobCardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobCards: Type[] = jobCardsToCheck.filter(isPresent);
    if (jobCards.length > 0) {
      const jobCardCollectionIdentifiers = jobCardCollection.map(jobCardItem => this.getJobCardIdentifier(jobCardItem)!);
      const jobCardsToAdd = jobCards.filter(jobCardItem => {
        const jobCardIdentifier = this.getJobCardIdentifier(jobCardItem);
        if (jobCardCollectionIdentifiers.includes(jobCardIdentifier)) {
          return false;
        }
        jobCardCollectionIdentifiers.push(jobCardIdentifier);
        return true;
      });
      return [...jobCardsToAdd, ...jobCardCollection];
    }
    return jobCardCollection;
  }

  protected convertDateFromClient<T extends IJobCard | NewJobCard | PartialUpdateJobCard>(jobCard: T): RestOf<T> {
    return {
      ...jobCard,
      startedOn: jobCard.startedOn?.toJSON() ?? null,
      completedOn: jobCard.completedOn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobCard: RestJobCard): IJobCard {
    return {
      ...restJobCard,
      startedOn: restJobCard.startedOn ? dayjs(restJobCard.startedOn) : undefined,
      completedOn: restJobCard.completedOn ? dayjs(restJobCard.completedOn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJobCard>): HttpResponse<IJobCard> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJobCard[]>): HttpResponse<IJobCard[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
