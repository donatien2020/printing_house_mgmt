import dayjs from 'dayjs/esm';
import { InvoiceActions } from 'app/entities/enumerations/invoice-actions.model';

export interface IInvoiceHistory {
  id: number;
  invoiceId?: number | null;
  action?: InvoiceActions | null;
  description?: string | null;
  doneOn?: dayjs.Dayjs | null;
}

export type NewInvoiceHistory = Omit<IInvoiceHistory, 'id'> & { id: null };
