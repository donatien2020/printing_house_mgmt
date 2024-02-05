import dayjs from 'dayjs/esm';

import { DebtStatuses } from 'app/entities/enumerations/debt-statuses.model';
import { DebtInvoicingStatuses } from 'app/entities/enumerations/debt-invoicing-statuses.model';

import { IDebtor, NewDebtor } from './debtor.model';

export const sampleWithRequiredData: IDebtor = {
  id: 14715,
  debtStatus: DebtStatuses['CANCELED'],
  invoicingStatus: DebtInvoicingStatuses['INVOICED'],
};

export const sampleWithPartialData: IDebtor = {
  id: 89662,
  serviceDescription: 'protocol Clothing',
  productDescription: 'Hat Practical Account',
  debtDate: dayjs('2023-10-26T09:18'),
  debtStatus: DebtStatuses['RECEIVED'],
  invoicingStatus: DebtInvoicingStatuses['PENDING'],
  paidAmount: 69343,
};

export const sampleWithFullData: IDebtor = {
  id: 2496,
  serviceDescription: 'Checking',
  productDescription: 'e-commerce withdrawal payment',
  debtDate: dayjs('2023-10-26T00:56'),
  debtStatus: DebtStatuses['CANCELED'],
  invoicingStatus: DebtInvoicingStatuses['PENDING'],
  totalAmount: 39318,
  paidAmount: 66975,
};

export const sampleWithNewData: NewDebtor = {
  debtStatus: DebtStatuses['RECEIVED'],
  invoicingStatus: DebtInvoicingStatuses['INVOICED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
