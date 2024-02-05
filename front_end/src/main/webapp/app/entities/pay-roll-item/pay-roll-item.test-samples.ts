import dayjs from 'dayjs/esm';

import { SalaryCollectionStatuses } from 'app/entities/enumerations/salary-collection-statuses.model';

import { IPayRollItem, NewPayRollItem } from './pay-roll-item.model';

export const sampleWithRequiredData: IPayRollItem = {
  id: 71344,
  divisionId: 99447,
  empId: 42367,
  empNumber: 'feed Handcrafted withdrawal',
  netAmount: 65295,
  grossAmount: 31520,
  collectionStatus: SalaryCollectionStatuses['COMPUTED'],
  collectionDate: dayjs('2023-10-26T14:34'),
  computationDate: dayjs('2023-10-26T04:56'),
};

export const sampleWithPartialData: IPayRollItem = {
  id: 1001,
  divisionId: 16817,
  empId: 11978,
  empNumber: 'Licensed Credit',
  netAmount: 54937,
  grossAmount: 998,
  collectionStatus: SalaryCollectionStatuses['COLLECTED'],
  collectionDate: dayjs('2023-10-25T22:29'),
  computationDate: dayjs('2023-10-26T00:23'),
};

export const sampleWithFullData: IPayRollItem = {
  id: 17419,
  divisionId: 77517,
  empId: 42794,
  empNumber: 'Wyoming',
  netAmount: 56429,
  grossAmount: 61013,
  collectionStatus: SalaryCollectionStatuses['LOCKED'],
  collectionDate: dayjs('2023-10-26T08:50'),
  computationDate: dayjs('2023-10-26T09:22'),
};

export const sampleWithNewData: NewPayRollItem = {
  divisionId: 7486,
  empId: 73459,
  empNumber: 'Assistant synergies',
  netAmount: 56225,
  grossAmount: 87176,
  collectionStatus: SalaryCollectionStatuses['COLLECTED'],
  collectionDate: dayjs('2023-10-25T21:54'),
  computationDate: dayjs('2023-10-25T20:37'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
