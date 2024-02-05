import dayjs from 'dayjs/esm';
import { IDebtor } from 'app/entities/debtor/debtor.model';
import { IClient } from 'app/entities/client/client.model';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { InvoicePaymentModes } from 'app/entities/enumerations/invoice-payment-modes.model';
import { PaymentTypes } from 'app/entities/enumerations/payment-types.model';
import { InvoiceTypes } from 'app/entities/enumerations/invoice-types.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

export interface IInvoice {
  id: number;
  invoiceNumber?: string | null;
  totalJobCards?: number | null;
  totalCost?: number | null;
  paymentMode?: InvoicePaymentModes | null;
  paymentType?: PaymentTypes | null;
  invoiceType?: InvoiceTypes | null;
  status?: InvoicingStatuses | null;
  receptionOrderId?: number | null;
  invoicedOn?: dayjs.Dayjs | null;
  dueOn?: dayjs.Dayjs | null;
  fromOrganizationId?: number | null;
  debtor?: Pick<IDebtor, 'id'> | null;
  invoiceToClient?: Pick<IClient, 'id'> | null;
  toOrganization?: Pick<IPOrganization, 'id'> | null;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
