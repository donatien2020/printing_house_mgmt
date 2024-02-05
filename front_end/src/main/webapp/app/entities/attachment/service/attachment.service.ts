import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttachment, NewAttachment } from '../attachment.model';

export type PartialUpdateAttachment = Partial<IAttachment> & Pick<IAttachment, 'id'>;

export type EntityResponseType = HttpResponse<IAttachment>;
export type EntityArrayResponseType = HttpResponse<IAttachment[]>;

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attachments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(attachment: NewAttachment): Observable<EntityResponseType> {
    return this.http.post<IAttachment>(this.resourceUrl, attachment, { observe: 'response' });
  }

  update(attachment: IAttachment): Observable<EntityResponseType> {
    return this.http.put<IAttachment>(`${this.resourceUrl}/${this.getAttachmentIdentifier(attachment)}`, attachment, {
      observe: 'response',
    });
  }

  partialUpdate(attachment: PartialUpdateAttachment): Observable<EntityResponseType> {
    return this.http.patch<IAttachment>(`${this.resourceUrl}/${this.getAttachmentIdentifier(attachment)}`, attachment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAttachment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAttachment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttachmentIdentifier(attachment: Pick<IAttachment, 'id'>): number {
    return attachment.id;
  }

  compareAttachment(o1: Pick<IAttachment, 'id'> | null, o2: Pick<IAttachment, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttachmentIdentifier(o1) === this.getAttachmentIdentifier(o2) : o1 === o2;
  }

  addAttachmentToCollectionIfMissing<Type extends Pick<IAttachment, 'id'>>(
    attachmentCollection: Type[],
    ...attachmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attachments: Type[] = attachmentsToCheck.filter(isPresent);
    if (attachments.length > 0) {
      const attachmentCollectionIdentifiers = attachmentCollection.map(attachmentItem => this.getAttachmentIdentifier(attachmentItem)!);
      const attachmentsToAdd = attachments.filter(attachmentItem => {
        const attachmentIdentifier = this.getAttachmentIdentifier(attachmentItem);
        if (attachmentCollectionIdentifiers.includes(attachmentIdentifier)) {
          return false;
        }
        attachmentCollectionIdentifiers.push(attachmentIdentifier);
        return true;
      });
      return [...attachmentsToAdd, ...attachmentCollection];
    }
    return attachmentCollection;
  }
}
