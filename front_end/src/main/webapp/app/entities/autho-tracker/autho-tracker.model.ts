import dayjs from 'dayjs/esm';
import { Status } from 'app/entities/enumerations/status.model';

export interface IAuthoTracker {
  id: number;
  username?: string | null;
  token?: string | null;
  status?: Status | null;
  logedInOn?: dayjs.Dayjs | null;
}

export type NewAuthoTracker = Omit<IAuthoTracker, 'id'> & { id: null };
