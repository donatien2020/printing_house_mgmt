import { Status } from 'app/entities/enumerations/status.model';

export interface ICompany {
  id: number;
  companyNames?: string | null;
  tinNumber?: string | null;
  description?: string | null;
  status?: Status | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
