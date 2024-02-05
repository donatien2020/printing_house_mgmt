import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';

import { IAuthoTracker, NewAuthoTracker } from './autho-tracker.model';

export const sampleWithRequiredData: IAuthoTracker = {
  id: 49793,
};

export const sampleWithPartialData: IAuthoTracker = {
  id: 12163,
  logedInOn: dayjs('2023-10-26T08:15'),
};

export const sampleWithFullData: IAuthoTracker = {
  id: 81922,
  username: 'bypassing',
  token: 'Soft',
  status: Status['DELETED'],
  logedInOn: dayjs('2023-10-25T22:28'),
};

export const sampleWithNewData: NewAuthoTracker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
