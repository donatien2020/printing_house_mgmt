import { ICompany } from 'app/entities/company/company.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ISupplier {
  id: number;
  address?: string | null;
  phoneNumber?: string | null;
  description?: string | null;
  specialization?: string | null;
  status?: Status | null;
  company?: Pick<ICompany, 'id'|'companyNames'> | null;
}

export type NewSupplier = Omit<ISupplier, 'id'> & { id: null };
