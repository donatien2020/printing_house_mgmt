import dayjs from 'dayjs/esm';

import { ILocationLevel, NewLocationLevel } from './location-level.model';

export const sampleWithRequiredData: ILocationLevel = {
  id: 58219,
  code: 'Account Implemented',
  name: 'Branding Small',
};

export const sampleWithPartialData: ILocationLevel = {
  id: 84232,
  code: 'invoice',
  name: 'California',
  createdOn: dayjs('2023-10-26T08:31'),
  createdByUsername: 'Hawaii Texas Keyboard',
  updatedById: 16935,
  updatedByUsername: 'Architect',
  updatedOn: dayjs('2023-10-26T14:02'),
};

export const sampleWithFullData: ILocationLevel = {
  id: 38685,
  code: 'Persistent hybrid Manager',
  name: 'web',
  createdOn: dayjs('2023-10-25T16:54'),
  createdById: 603,
  createdByUsername: 'deploy open-source',
  updatedById: 35250,
  updatedByUsername: 'Outdoors National',
  updatedOn: dayjs('2023-10-25T17:01'),
};

export const sampleWithNewData: NewLocationLevel = {
  code: 'Pakistan Salad',
  name: 'Island',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
