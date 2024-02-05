import { EngagementReasons } from 'app/entities/enumerations/engagement-reasons.model';

export interface IFinancialClientEngagement {
  id: number;
  userId?: number | null;
  clientId?: number | null;
  clientNames?: number | null;
  discussionSummary?: string | null;
  reason?: EngagementReasons | null;
  conclusion?: string | null;
  contractId?: number | null;
}

export type NewFinancialClientEngagement = Omit<IFinancialClientEngagement, 'id'> & { id: null };
