import dayjs from 'dayjs/esm';

import { EmploymentStatuses } from 'app/entities/enumerations/employment-statuses.model';
import { EmploymentTypes } from 'app/entities/enumerations/employment-types.model';
import { PaymentPeriods } from 'app/entities/enumerations/payment-periods.model';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
  empNumber: 'transmitting',
  status: EmploymentStatuses['SUSPENDED'],
  empType: EmploymentTypes['CONTRACTUAL'],
  paymentPeriod: PaymentPeriods['MONTHLY'],
};

export const sampleWithPartialData: IEmployee = {
  id: 14006,
  empNumber: 'Administrator ADP',
  description: 'internet Ville strategic',
  phoneNumber: 'paradigm',
  email: 'Travis_Toy@hotmail.com',
  status: EmploymentStatuses['DISMISSED'],
  terminatedOn: dayjs('2023-10-26T04:01'),
  empType: EmploymentTypes['CONTRACTUAL'],
  paymentPeriod: PaymentPeriods['DAILY'],
};

export const sampleWithFullData: IEmployee = {
  id: 97734,
  empNumber: 'viral Rubber Fundamental',
  description: 'Global Tuna',
  phoneNumber: 'Knoll Indiana',
  email: 'Jovan_Kerluke65@hotmail.com',
  status: EmploymentStatuses['SUSPENDED'],
  startedOn: dayjs('2023-10-26T13:24'),
  terminatedOn: dayjs('2023-10-26T09:53'),
  empType: EmploymentTypes['CONTRACTUAL'],
  basePayment: 3076,
  netPayment: 11720,
  grossPayment: 2373,
  paymentPeriod: PaymentPeriods['DAILY'],
};

export const sampleWithNewData: NewEmployee = {
  empNumber: 'Factors',
  status: EmploymentStatuses['RECRUITED'],
  empType: EmploymentTypes['CASUAL'],
  paymentPeriod: PaymentPeriods['MONTHLY'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
