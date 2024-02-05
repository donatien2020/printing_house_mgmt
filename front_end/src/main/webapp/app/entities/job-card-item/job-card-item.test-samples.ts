import { JobCardItemStatuses } from 'app/entities/enumerations/job-card-item-statuses.model';

import { IJobCardItem, NewJobCardItem } from './job-card-item.model';

export const sampleWithRequiredData: IJobCardItem = {
  id: 66347,
  quantity: 34678,
  unitPrice: 71809,
  status: JobCardItemStatuses['DELETED'],
};

export const sampleWithPartialData: IJobCardItem = {
  id: 852,
  quantity: 25032,
  unitPrice: 53800,
  status: JobCardItemStatuses['USED'],
};

export const sampleWithFullData: IJobCardItem = {
  id: 77182,
  quantity: 91917,
  unitPrice: 44653,
  status: JobCardItemStatuses['USED'],
};

export const sampleWithNewData: NewJobCardItem = {
  quantity: 43473,
  unitPrice: 22245,
  status: JobCardItemStatuses['ADDED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
