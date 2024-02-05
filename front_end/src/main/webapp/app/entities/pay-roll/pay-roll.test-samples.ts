import dayjs from 'dayjs/esm';

import { PaymentStatuses } from 'app/entities/enumerations/payment-statuses.model';

import { IPayRoll, NewPayRoll } from './pay-roll.model';

export const sampleWithRequiredData: IPayRoll = {
  id: 16109,
  organizationId: 483,
  payFrom: dayjs('2023-10-25'),
  payTo: dayjs('2023-10-25'),
  status: PaymentStatuses['PAID'],
  totalGrossAmount: 38669,
  totalNetAmount: 22214,
};

export const sampleWithPartialData: IPayRoll = {
  id: 42448,
  organizationId: 26943,
  payFrom: dayjs('2023-10-25'),
  payTo: dayjs('2023-10-26'),
  status: PaymentStatuses['INITIAL'],
  totalGrossAmount: 89207,
  totalNetAmount: 91994,
};

export const sampleWithFullData: IPayRoll = {
  id: 84816,
  organizationId: 18560,
  payFrom: dayjs('2023-10-26'),
  payTo: dayjs('2023-10-26'),
  status: PaymentStatuses['CANCELED'],
  totalGrossAmount: 99796,
  totalNetAmount: 82963,
};

export const sampleWithNewData: NewPayRoll = {
  organizationId: 663,
  payFrom: dayjs('2023-10-26'),
  payTo: dayjs('2023-10-25'),
  status: PaymentStatuses['PAID'],
  totalGrossAmount: 93633,
  totalNetAmount: 38813,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
