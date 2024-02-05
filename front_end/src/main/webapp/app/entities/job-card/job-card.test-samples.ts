import dayjs from 'dayjs/esm';

import { PerformanceMeasures } from 'app/entities/enumerations/performance-measures.model';
import { JobCardStatuses } from 'app/entities/enumerations/job-card-statuses.model';

import { IJobCard, NewJobCard } from './job-card.model';

export const sampleWithRequiredData: IJobCard = {
  id: 91064,
  quantity: 81670,
  unitPrice: 30936,
  divisionId: 16270,
  divisionName: 72059,
  performance: PerformanceMeasures['FIRST_ASSIGNMENT'],
  status: JobCardStatuses['COMPLETED'],
};

export const sampleWithPartialData: IJobCard = {
  id: 32715,
  description: 'Street',
  quantity: 17236,
  unitPrice: 90855,
  startedOn: dayjs('2023-10-26T11:27'),
  divisionId: 62199,
  divisionName: 20501,
  performance: PerformanceMeasures['RE_ASSIGNED'],
  status: JobCardStatuses['COMPLETED'],
};

export const sampleWithFullData: IJobCard = {
  id: 97222,
  description: 'Texas Handmade',
  quantity: 68918,
  unitPrice: 85581,
  startedOn: dayjs('2023-10-26T07:54'),
  completedOn: dayjs('2023-10-26T14:50'),
  divisionId: 50203,
  divisionName: 96830,
  performance: PerformanceMeasures['FIRST_ASSIGNMENT'],
  status: JobCardStatuses['STARTED'],
};

export const sampleWithNewData: NewJobCard = {
  quantity: 38458,
  unitPrice: 50743,
  divisionId: 18157,
  divisionName: 35418,
  performance: PerformanceMeasures['RE_ASSIGNED'],
  status: JobCardStatuses['STARTED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
