import dayjs from 'dayjs/esm';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { DebtStatuses } from 'app/entities/enumerations/debt-statuses.model';
import { DebtInvoicingStatuses } from 'app/entities/enumerations/debt-invoicing-statuses.model';

export interface IDebtor {
  id: number;
  serviceDescription?: string | null;
  productDescription?: string | null;
  debtDate?: dayjs.Dayjs | null;
  debtStatus?: DebtStatuses | null;
  invoicingStatus?: DebtInvoicingStatuses | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  supplier?: Pick<ISupplier, 'id' | 'address'> | null;
}

export type NewDebtor = Omit<IDebtor, 'id'> & { id: null };
