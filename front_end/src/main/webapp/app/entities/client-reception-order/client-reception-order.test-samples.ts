import dayjs from 'dayjs/esm';

import { ClientReceptionModes } from 'app/entities/enumerations/client-reception-modes.model';
import { OrderStatuses } from 'app/entities/enumerations/order-statuses.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

import { IClientReceptionOrder, NewClientReceptionOrder } from './client-reception-order.model';

export const sampleWithRequiredData: IClientReceptionOrder = {
  id: 43425,
  orderNumber: 'purple',
  divisionId: 72965,
  receptionMode: ClientReceptionModes['QUOTATION'],
  assignedToDivisionNames: 64089,
  assignedToEmployeeNames: 4984,
  orderingStatus: OrderStatuses['CANCELED'],
  invoicingStatus: InvoicingStatuses['INVOICED'],
};

export const sampleWithPartialData: IClientReceptionOrder = {
  id: 3172,
  orderNumber: 'Passage Refined Pass',
  divisionId: 17473,
  receptionMode: ClientReceptionModes['ORDER_FORM'],
  totalJobCards: 87772,
  deliveryDate: dayjs('2023-10-25T22:25'),
  assignedToDivisionNames: 4183,
  assignedToEmployeeNames: 68069,
  orderingStatus: OrderStatuses['ASSIGNED'],
  invoicingStatus: InvoicingStatuses['REVERSED'],
};

export const sampleWithFullData: IClientReceptionOrder = {
  id: 78086,
  orderNumber: 'Lilangeni',
  divisionId: 49539,
  receivedOn: dayjs('2023-10-26T05:58'),
  receptionMode: ClientReceptionModes['LOCAL_PURCHASE_ORDER'],
  jobDescription: 'Usability',
  totalCost: 27980,
  totalJobCards: 89814,
  deliveryDate: dayjs('2023-10-26T08:20'),
  assignedToDivisionNames: 83718,
  assignedToEmployeeNames: 94611,
  orderingStatus: OrderStatuses['CANCELED'],
  invoicingStatus: InvoicingStatuses['INITIAL'],
};

export const sampleWithNewData: NewClientReceptionOrder = {
  orderNumber: 'e-tailers',
  divisionId: 50071,
  receptionMode: ClientReceptionModes['ORDER_FORM'],
  assignedToDivisionNames: 14102,
  assignedToEmployeeNames: 10149,
  orderingStatus: OrderStatuses['STARTED'],
  invoicingStatus: InvoicingStatuses['REVERSED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
