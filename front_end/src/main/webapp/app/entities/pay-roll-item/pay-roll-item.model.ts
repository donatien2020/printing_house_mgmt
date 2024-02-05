import dayjs from 'dayjs/esm';
import { IPayRoll } from 'app/entities/pay-roll/pay-roll.model';
import { SalaryCollectionStatuses } from 'app/entities/enumerations/salary-collection-statuses.model';

export interface IPayRollItem {
  id: number;
  divisionId?: number | null;
  empId?: number | null;
  empNumber?: string | null;
  netAmount?: number | null;
  grossAmount?: number | null;
  collectionStatus?: SalaryCollectionStatuses | null;
  collectionDate?: dayjs.Dayjs | null;
  computationDate?: dayjs.Dayjs | null;
  payRoll?: Pick<IPayRoll, 'id'|'payFrom'> | null;
}

export type NewPayRollItem = Omit<IPayRollItem, 'id'> & { id: null };
