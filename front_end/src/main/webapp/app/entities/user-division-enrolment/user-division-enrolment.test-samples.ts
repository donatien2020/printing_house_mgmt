import dayjs from 'dayjs/esm';

import { EnrollmentStatus } from 'app/entities/enumerations/enrollment-status.model';

import { IUserDivisionEnrolment, NewUserDivisionEnrolment } from './user-division-enrolment.model';

export const sampleWithRequiredData: IUserDivisionEnrolment = {
  id: 48691,
  startedOn: dayjs('2023-10-26T10:08'),
  status: EnrollmentStatus['REMOVED'],
};

export const sampleWithPartialData: IUserDivisionEnrolment = {
  id: 83055,
  startedOn: dayjs('2023-10-25T21:42'),
  status: EnrollmentStatus['REMOVED'],
};

export const sampleWithFullData: IUserDivisionEnrolment = {
  id: 42272,
  startedOn: dayjs('2023-10-26T01:27'),
  endedOn: dayjs('2023-10-26T09:52'),
  status: EnrollmentStatus['REMOVED'],
};

export const sampleWithNewData: NewUserDivisionEnrolment = {
  startedOn: dayjs('2023-10-26T10:23'),
  status: EnrollmentStatus['ENROLLED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
