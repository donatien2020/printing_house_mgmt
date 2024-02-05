import { JobCardAssignmentModes } from 'app/entities/enumerations/job-card-assignment-modes.model';
import { JobCardAssignmentStatuses } from 'app/entities/enumerations/job-card-assignment-statuses.model';

import { IJobCardAssignment, NewJobCardAssignment } from './job-card-assignment.model';

export const sampleWithRequiredData: IJobCardAssignment = {
  id: 82392,
  assignedToId: 57782,
  assignedNames: 28084,
  description: 'Security white',
  assignmentMode: JobCardAssignmentModes['INTERVENED'],
  status: JobCardAssignmentStatuses['CANCELED'],
};

export const sampleWithPartialData: IJobCardAssignment = {
  id: 15670,
  assignedToId: 4573,
  assignedNames: 32858,
  description: 'Cambridgeshire Generic Forge',
  assignmentMode: JobCardAssignmentModes['FIRST'],
  status: JobCardAssignmentStatuses['DE_ASSIGENED'],
};

export const sampleWithFullData: IJobCardAssignment = {
  id: 81597,
  assignedToId: 42190,
  assignedNames: 92589,
  description: 'Kansas payment',
  assignmentMode: JobCardAssignmentModes['INTERVENED'],
  status: JobCardAssignmentStatuses['RE_ASSIGNED'],
};

export const sampleWithNewData: NewJobCardAssignment = {
  assignedToId: 41384,
  assignedNames: 74078,
  description: 'payment intuitive alarm',
  assignmentMode: JobCardAssignmentModes['REDO'],
  status: JobCardAssignmentStatuses['RE_ASSIGNED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
