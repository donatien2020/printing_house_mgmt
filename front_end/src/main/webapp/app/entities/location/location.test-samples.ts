import dayjs from 'dayjs/esm';

import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 91847,
  code: 'parsing',
  name: 'Handcrafted Lead monetize',
};

export const sampleWithPartialData: ILocation = {
  id: 6297,
  code: 'primary Computer',
  name: 'integrate mission-critical solution',
  createdOn: dayjs('2023-10-26T06:41'),
  createdById: 14345,
  createdByUsername: 'network',
  updatedById: 14456,
  updatedByUsername: 'Tools',
  updatedOn: dayjs('2023-10-26T14:53'),
};

export const sampleWithFullData: ILocation = {
  id: 25255,
  code: 'bypass',
  name: 'bleeding-edge Upgradable',
  description: 'JBOD redundant',
  createdOn: dayjs('2023-10-25T19:07'),
  createdById: 99293,
  createdByUsername: 'Salad Books capacitor',
  updatedById: 81408,
  updatedByUsername: 'Industrial',
  updatedOn: dayjs('2023-10-25T19:32'),
};

export const sampleWithNewData: NewLocation = {
  code: 'up Metal Avon',
  name: 'utilisation',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
