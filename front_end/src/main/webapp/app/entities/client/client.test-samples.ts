import { ClientTypes } from 'app/entities/enumerations/client-types.model';
import { EngagementModes } from 'app/entities/enumerations/engagement-modes.model';

import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
  clientType: ClientTypes['COMPANY'],
  engagementMode: EngagementModes['PASSENGER'],
  organizationId: 13837,
};

export const sampleWithPartialData: IClient = {
  id: 7178,
  clientType: ClientTypes['COMPANY'],
  engagementMode: EngagementModes['PASSENGER'],
  currentContractId: 90213,
  contactPhoneNumber: 'Concrete Response Borders',
  organizationId: 92405,
};

export const sampleWithFullData: IClient = {
  id: 90261,
  clientType: ClientTypes['COMPANY'],
  engagementMode: EngagementModes['CONTRACTUAL'],
  address: 'Multi-tiered',
  currentContractId: 17055,
  contactPhoneNumber: 'Washington synthesize',
  organizationId: 588,
};

export const sampleWithNewData: NewClient = {
  clientType: ClientTypes['COMPANY'],
  engagementMode: EngagementModes['PASSENGER'],
  organizationId: 77323,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
