import { FileTypes } from 'app/entities/enumerations/file-types.model';
import { FileExtensions } from 'app/entities/enumerations/file-extensions.model';
import { FileOwnerTypes } from 'app/entities/enumerations/file-owner-types.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IAttachment, NewAttachment } from './attachment.model';

export const sampleWithRequiredData: IAttachment = {
  id: 43624,
};

export const sampleWithPartialData: IAttachment = {
  id: 51189,
  fileName: 'Refined Proactive Rue',
  pathToFile: 'payment',
  type: FileTypes['VIDEO'],
  extension: FileExtensions['JPEG'],
  ownerId: 46514,
  status: Status['INACTIVE'],
};

export const sampleWithFullData: IAttachment = {
  id: 26688,
  description: 'payment',
  fileName: 'SDR',
  pathToFile: 'Cambridgeshire',
  type: FileTypes['VIDEO'],
  extension: FileExtensions['DOCX'],
  ownerType: FileOwnerTypes['ORGANIZATION'],
  ownerId: 51894,
  status: Status['DELETED'],
};

export const sampleWithNewData: NewAttachment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
