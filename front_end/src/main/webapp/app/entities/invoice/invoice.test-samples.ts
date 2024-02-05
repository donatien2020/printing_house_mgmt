import dayjs from 'dayjs/esm';

import { InvoicePaymentModes } from 'app/entities/enumerations/invoice-payment-modes.model';
import { PaymentTypes } from 'app/entities/enumerations/payment-types.model';
import { InvoiceTypes } from 'app/entities/enumerations/invoice-types.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 91509,
  invoiceNumber: 'Avon Mandatory',
  totalCost: 18841,
  paymentMode: InvoicePaymentModes['BANK_TRANSFER'],
  paymentType: PaymentTypes['INSTANT'],
  invoiceType: InvoiceTypes['REFUND'],
  status: InvoicingStatuses['INITIAL'],
  receptionOrderId: 55368,
  fromOrganizationId: 32294,
};

export const sampleWithPartialData: IInvoice = {
  id: 96503,
  invoiceNumber: 'Arkansas auxiliary Togo',
  totalJobCards: 28832,
  totalCost: 94473,
  paymentMode: InvoicePaymentModes['CHECK_DEPOSIT'],
  paymentType: PaymentTypes['CREDIT'],
  invoiceType: InvoiceTypes['SALES'],
  status: InvoicingStatuses['PAID'],
  receptionOrderId: 17005,
  invoicedOn: dayjs('2023-10-25T23:37'),
  dueOn: dayjs('2023-10-26T13:12'),
  fromOrganizationId: 13727,
};

export const sampleWithFullData: IInvoice = {
  id: 61424,
  invoiceNumber: 'navigate',
  totalJobCards: 94943,
  totalCost: 82285,
  paymentMode: InvoicePaymentModes['CASH'],
  paymentType: PaymentTypes['INSTANT'],
  invoiceType: InvoiceTypes['SALES'],
  status: InvoicingStatuses['INITIAL'],
  receptionOrderId: 50235,
  invoicedOn: dayjs('2023-10-26T06:50'),
  dueOn: dayjs('2023-10-25T19:14'),
  fromOrganizationId: 5746,
};

export const sampleWithNewData: NewInvoice = {
  invoiceNumber: 'Soft',
  totalCost: 51427,
  paymentMode: InvoicePaymentModes['MOBILE_MONEY'],
  paymentType: PaymentTypes['CREDIT'],
  invoiceType: InvoiceTypes['BILL'],
  status: InvoicingStatuses['INVOICED'],
  receptionOrderId: 54066,
  fromOrganizationId: 73083,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
