import { EngagementReasons } from 'app/entities/enumerations/engagement-reasons.model';

import { IFinancialClientEngagement, NewFinancialClientEngagement } from './financial-client-engagement.model';

export const sampleWithRequiredData: IFinancialClientEngagement = {
  id: 65083,
  userId: 8193,
  clientId: 20213,
  clientNames: 38525,
  reason: EngagementReasons['CONTRACT_RENEWAL'],
};

export const sampleWithPartialData: IFinancialClientEngagement = {
  id: 40150,
  userId: 51003,
  clientId: 75888,
  clientNames: 8860,
  reason: EngagementReasons['RECOVERY'],
  conclusion: 'Quality-focused',
  contractId: 75701,
};

export const sampleWithFullData: IFinancialClientEngagement = {
  id: 62927,
  userId: 46205,
  clientId: 21048,
  clientNames: 39786,
  discussionSummary: 'deposit',
  reason: EngagementReasons['MARKETING'],
  conclusion: 'Lake Connecticut',
  contractId: 8385,
};

export const sampleWithNewData: NewFinancialClientEngagement = {
  userId: 74905,
  clientId: 13756,
  clientNames: 4786,
  reason: EngagementReasons['MARKETING'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
