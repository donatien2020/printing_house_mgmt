import { IPerson } from 'app/entities/person/person.model';
import { ICompany } from 'app/entities/company/company.model';
import { ILocation } from 'app/entities/location/location.model';
import { ClientTypes } from 'app/entities/enumerations/client-types.model';
import { EngagementModes } from 'app/entities/enumerations/engagement-modes.model';

export interface IClient {
  id: number;
  clientType?: ClientTypes | null;
  engagementMode?: EngagementModes | null;
  address?: string | null;
  currentContractId?: number | null;
  contactPhoneNumber?: string | null;
  organizationId?: number | null;
  person?: Pick<IPerson, 'id'> | null;
  company?: Pick<ICompany, 'id'> | null;
  residenceLocation?: Pick<ILocation, 'id'> | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
