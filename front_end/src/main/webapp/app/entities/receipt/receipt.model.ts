import dayjs from 'dayjs/esm';

export interface IReceipt {
  id: number;
  invoiceId?: number | null;
  totalCost?: number | null;
  totalPaid?: number | null;
  balance?: number | null;
  paymentDate?: dayjs.Dayjs | null;
  receivedByNames?: string | null;
}

export type NewReceipt = Omit<IReceipt, 'id'> & { id: null };
