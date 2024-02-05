import dayjs from 'dayjs/esm';

import { IReceipt, NewReceipt } from './receipt.model';

export const sampleWithRequiredData: IReceipt = {
  id: 60359,
  invoiceId: 53698,
  totalCost: 5803,
  totalPaid: 40784,
  balance: 442,
  paymentDate: dayjs('2023-10-26T06:39'),
  receivedByNames: 'Iowa',
};

export const sampleWithPartialData: IReceipt = {
  id: 19416,
  invoiceId: 92991,
  totalCost: 63353,
  totalPaid: 78723,
  balance: 18410,
  paymentDate: dayjs('2023-10-26T09:47'),
  receivedByNames: 'RSS Highway parsing',
};

export const sampleWithFullData: IReceipt = {
  id: 98766,
  invoiceId: 78813,
  totalCost: 58869,
  totalPaid: 81434,
  balance: 41635,
  paymentDate: dayjs('2023-10-26T02:18'),
  receivedByNames: 'Credit',
};

export const sampleWithNewData: NewReceipt = {
  invoiceId: 85374,
  totalCost: 11980,
  totalPaid: 4888,
  balance: 81310,
  paymentDate: dayjs('2023-10-26T04:55'),
  receivedByNames: 'Metal',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
