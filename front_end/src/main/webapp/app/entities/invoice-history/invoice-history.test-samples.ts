import dayjs from 'dayjs/esm';

import { InvoiceActions } from 'app/entities/enumerations/invoice-actions.model';

import { IInvoiceHistory, NewInvoiceHistory } from './invoice-history.model';

export const sampleWithRequiredData: IInvoiceHistory = {
  id: 28147,
  invoiceId: 29925,
  action: InvoiceActions['CANCELLATION'],
  description: 'Engineer Gourde Supervisor',
  doneOn: dayjs('2023-10-26T03:18'),
};

export const sampleWithPartialData: IInvoiceHistory = {
  id: 35773,
  invoiceId: 24976,
  action: InvoiceActions['REFUNDING'],
  description: 'quantify',
  doneOn: dayjs('2023-10-26T15:14'),
};

export const sampleWithFullData: IInvoiceHistory = {
  id: 29612,
  invoiceId: 72258,
  action: InvoiceActions['CANCELLATION'],
  description: 'Chips Refined Mississippi',
  doneOn: dayjs('2023-10-26T08:23'),
};

export const sampleWithNewData: NewInvoiceHistory = {
  invoiceId: 84412,
  action: InvoiceActions['CREATION'],
  description: 'Unbranded',
  doneOn: dayjs('2023-10-26T15:51'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
