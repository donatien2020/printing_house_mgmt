import { IJobCard } from 'app/entities/job-card/job-card.model';
import { JobCardAssignmentModes } from 'app/entities/enumerations/job-card-assignment-modes.model';
import { JobCardAssignmentStatuses } from 'app/entities/enumerations/job-card-assignment-statuses.model';

export interface IJobCardAssignment {
  id: number;
  assignedToId?: number | null;
  assignedNames?: number | null;
  description?: string | null;
  assignmentMode?: JobCardAssignmentModes | null;
  status?: JobCardAssignmentStatuses | null;
  jobCard?: Pick<IJobCard, 'id'|'description'> | null;
}

export type NewJobCardAssignment = Omit<IJobCardAssignment, 'id'> & { id: null };
