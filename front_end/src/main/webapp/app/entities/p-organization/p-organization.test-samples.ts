import { CompanyTypes } from 'app/entities/enumerations/company-types.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IPOrganization, NewPOrganization } from './p-organization.model';

export const sampleWithRequiredData: IPOrganization = {
  id: 856,
  officeAddress: 'ADP',
  description: 'didactic Implementation Tactics',
  companyType: CompanyTypes['PROVIDER'],
  status: Status['ACTIVE'],
};

export const sampleWithPartialData: IPOrganization = {
  id: 62498,
  officeAddress: 'deploy Inverse calculating',
  description: 'Bulgarian Developer',
  companyType: CompanyTypes['RESELLER'],
  status: Status['INACTIVE'],
};

export const sampleWithFullData: IPOrganization = {
  id: 11953,
  officeAddress: 'navigate Customer Chicken',
  description: '1080p explicit',
  profileID: 73369,
  companyType: CompanyTypes['PROVIDER'],
  status: Status['INACTIVE'],
};

export const sampleWithNewData: NewPOrganization = {
  officeAddress: 'Junction XSS',
  description: 'Creative',
  companyType: CompanyTypes['PROVIDER'],
  status: Status['INACTIVE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
