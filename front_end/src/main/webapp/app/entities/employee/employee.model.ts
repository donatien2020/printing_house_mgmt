import dayjs from 'dayjs/esm';
import { IDivision } from 'app/entities/division/division.model';
import { IPerson } from 'app/entities/person/person.model';
import { EmploymentStatuses } from 'app/entities/enumerations/employment-statuses.model';
import { EmploymentTypes } from 'app/entities/enumerations/employment-types.model';
import { PaymentPeriods } from 'app/entities/enumerations/payment-periods.model';

export interface IEmployee {
  id: number;
  empNumber?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  status?: EmploymentStatuses | null;
  startedOn?: dayjs.Dayjs | null;
  terminatedOn?: dayjs.Dayjs | null;
  empType?: EmploymentTypes | null;
  basePayment?: number | null;
  netPayment?: number | null;
  grossPayment?: number | null;
  paymentPeriod?: PaymentPeriods | null;
  division?: Pick<IDivision, 'id' | 'name'> | null;
  person?: Pick<IPerson, 'id'| 'firstName'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
