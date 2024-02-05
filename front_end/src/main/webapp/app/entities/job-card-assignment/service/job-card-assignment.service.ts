import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobCardAssignment, NewJobCardAssignment } from '../job-card-assignment.model';

export type PartialUpdateJobCardAssignment = Partial<IJobCardAssignment> & Pick<IJobCardAssignment, 'id'>;

export type EntityResponseType = HttpResponse<IJobCardAssignment>;
export type EntityArrayResponseType = HttpResponse<IJobCardAssignment[]>;

@Injectable({ providedIn: 'root' })
export class JobCardAssignmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-card-assignments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobCardAssignment: NewJobCardAssignment): Observable<EntityResponseType> {
    return this.http.post<IJobCardAssignment>(this.resourceUrl, jobCardAssignment, { observe: 'response' });
  }

  update(jobCardAssignment: IJobCardAssignment): Observable<EntityResponseType> {
    return this.http.put<IJobCardAssignment>(
      `${this.resourceUrl}/${this.getJobCardAssignmentIdentifier(jobCardAssignment)}`,
      jobCardAssignment,
      { observe: 'response' }
    );
  }

  partialUpdate(jobCardAssignment: PartialUpdateJobCardAssignment): Observable<EntityResponseType> {
    return this.http.patch<IJobCardAssignment>(
      `${this.resourceUrl}/${this.getJobCardAssignmentIdentifier(jobCardAssignment)}`,
      jobCardAssignment,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobCardAssignment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobCardAssignment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJobCardAssignmentIdentifier(jobCardAssignment: Pick<IJobCardAssignment, 'id'>): number {
    return jobCardAssignment.id;
  }

  compareJobCardAssignment(o1: Pick<IJobCardAssignment, 'id'> | null, o2: Pick<IJobCardAssignment, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobCardAssignmentIdentifier(o1) === this.getJobCardAssignmentIdentifier(o2) : o1 === o2;
  }

  addJobCardAssignmentToCollectionIfMissing<Type extends Pick<IJobCardAssignment, 'id'>>(
    jobCardAssignmentCollection: Type[],
    ...jobCardAssignmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobCardAssignments: Type[] = jobCardAssignmentsToCheck.filter(isPresent);
    if (jobCardAssignments.length > 0) {
      const jobCardAssignmentCollectionIdentifiers = jobCardAssignmentCollection.map(
        jobCardAssignmentItem => this.getJobCardAssignmentIdentifier(jobCardAssignmentItem)!
      );
      const jobCardAssignmentsToAdd = jobCardAssignments.filter(jobCardAssignmentItem => {
        const jobCardAssignmentIdentifier = this.getJobCardAssignmentIdentifier(jobCardAssignmentItem);
        if (jobCardAssignmentCollectionIdentifiers.includes(jobCardAssignmentIdentifier)) {
          return false;
        }
        jobCardAssignmentCollectionIdentifiers.push(jobCardAssignmentIdentifier);
        return true;
      });
      return [...jobCardAssignmentsToAdd, ...jobCardAssignmentCollection];
    }
    return jobCardAssignmentCollection;
  }
}
