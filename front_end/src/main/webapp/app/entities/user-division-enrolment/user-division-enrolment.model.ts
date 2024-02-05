import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IDivision } from 'app/entities/division/division.model';
import { EnrollmentStatus } from 'app/entities/enumerations/enrollment-status.model';

export interface IUserDivisionEnrolment {
  id: number;
  startedOn?: dayjs.Dayjs | null;
  endedOn?: dayjs.Dayjs | null;
  status?: EnrollmentStatus | null;
  user?: Pick<IUser, 'id'> | null;
  division?: Pick<IDivision, 'id'> | null;
}

export type NewUserDivisionEnrolment = Omit<IUserDivisionEnrolment, 'id'> & { id: null };
