import { ICompany } from 'app/entities/company/company.model';
import { ILocation } from 'app/entities/location/location.model';
import { CompanyTypes } from 'app/entities/enumerations/company-types.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IPOrganization {
  id: number;
  officeAddress?: string | null;
  description?: string | null;
  profileID?: number | null;
  companyType?: CompanyTypes | null;
  status?: Status | null;
  company?: Pick<ICompany, 'id' |'companyNames' > | null;
  officeLocation?: Pick<ILocation, 'id' | 'name'> | null;
  parent?: Pick<IPOrganization,'id' | 'description'> | null;
}

export type NewPOrganization = Omit<IPOrganization, 'id'> & { id: null };
