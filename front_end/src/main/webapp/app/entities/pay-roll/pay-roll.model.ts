import dayjs from 'dayjs/esm';
import { PaymentStatuses } from 'app/entities/enumerations/payment-statuses.model';

export interface IPayRoll {
  id: number;
  organizationId?: number | null;
  payFrom?: dayjs.Dayjs | null;
  payTo?: dayjs.Dayjs | null;
  status?: PaymentStatuses | null;
  totalGrossAmount?: number | null;
  totalNetAmount?: number | null;
}

export type NewPayRoll = Omit<IPayRoll, 'id'> & { id: null };
