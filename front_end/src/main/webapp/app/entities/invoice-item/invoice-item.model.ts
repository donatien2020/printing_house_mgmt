import { InvoiceItemTypes } from 'app/entities/enumerations/invoice-item-types.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IInvoiceItem {
  id: number;
  itemId?: number | null;
  invoiceId?: number | null;
  itemType?: InvoiceItemTypes | null;
  unitPrice?: number | null;
  quantity?: number | null;
  totalCost?: number | null;
  status?: Status | null;
}

export type NewInvoiceItem = Omit<IInvoiceItem, 'id'> & { id: null };
