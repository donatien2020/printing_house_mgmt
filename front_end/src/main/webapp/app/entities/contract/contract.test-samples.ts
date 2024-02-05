import dayjs from 'dayjs/esm';

import { ContractTypes } from 'app/entities/enumerations/contract-types.model';
import { Status } from 'app/entities/enumerations/status.model';
import { ContractOwnerTypes } from 'app/entities/enumerations/contract-owner-types.model';
import { ContractAcquiringStatuses } from 'app/entities/enumerations/contract-acquiring-statuses.model';

import { IContract, NewContract } from './contract.model';

export const sampleWithRequiredData: IContract = {
  id: 90219,
  contractType: ContractTypes['NORMAL_SALES'],
  contractNumber: 'Integration',
  status: Status['INACTIVE'],
  ownerId: 26110,
  ownerType: ContractOwnerTypes['CLIENT'],
  acquiringStatus: ContractAcquiringStatuses['RENEWED'],
};

export const sampleWithPartialData: IContract = {
  id: 22890,
  contractType: ContractTypes['NORMAL_SALES'],
  contractNumber: 'Refined',
  validFrom: dayjs('2023-10-25T21:57'),
  status: Status['DELETED'],
  ownerId: 60931,
  ownerType: ContractOwnerTypes['DEBTOR'],
  acquiringStatus: ContractAcquiringStatuses['NEW'],
};

export const sampleWithFullData: IContract = {
  id: 16324,
  contractType: ContractTypes['EMPLOYMENT'],
  contractNumber: 'generating to',
  description: 'Focused definition',
  validFrom: dayjs('2023-10-26T15:13'),
  validTo: dayjs('2023-10-25T22:54'),
  status: Status['DELETED'],
  currentAttachmentId: 84217,
  ownerId: 3624,
  ownerType: ContractOwnerTypes['EMPLOYEE'],
  acquiringStatus: ContractAcquiringStatuses['NEW'],
};

export const sampleWithNewData: NewContract = {
  contractType: ContractTypes['EMPLOYMENT'],
  contractNumber: 'Ergonomic',
  status: Status['INACTIVE'],
  ownerId: 72062,
  ownerType: ContractOwnerTypes['EMPLOYEE'],
  acquiringStatus: ContractAcquiringStatuses['RENEWED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
