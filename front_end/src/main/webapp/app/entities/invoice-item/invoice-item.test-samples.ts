import { InvoiceItemTypes } from 'app/entities/enumerations/invoice-item-types.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IInvoiceItem, NewInvoiceItem } from './invoice-item.model';

export const sampleWithRequiredData: IInvoiceItem = {
  id: 36113,
  itemId: 59139,
  invoiceId: 36439,
  itemType: InvoiceItemTypes['SERVICE'],
  unitPrice: 35693,
  quantity: 75466,
  totalCost: 87043,
  status: Status['ACTIVE'],
};

export const sampleWithPartialData: IInvoiceItem = {
  id: 90074,
  itemId: 61272,
  invoiceId: 54215,
  itemType: InvoiceItemTypes['PRODUCT'],
  unitPrice: 9996,
  quantity: 19492,
  totalCost: 51932,
  status: Status['DELETED'],
};

export const sampleWithFullData: IInvoiceItem = {
  id: 25900,
  itemId: 94138,
  invoiceId: 59989,
  itemType: InvoiceItemTypes['JOB_CARD'],
  unitPrice: 13442,
  quantity: 45058,
  totalCost: 91133,
  status: Status['ACTIVE'],
};

export const sampleWithNewData: NewInvoiceItem = {
  itemId: 76596,
  invoiceId: 13035,
  itemType: InvoiceItemTypes['PRODUCT'],
  unitPrice: 69286,
  quantity: 97286,
  totalCost: 96451,
  status: Status['INACTIVE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
