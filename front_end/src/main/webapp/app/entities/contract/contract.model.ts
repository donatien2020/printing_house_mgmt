import dayjs from 'dayjs/esm';
import { ContractTypes } from 'app/entities/enumerations/contract-types.model';
import { Status } from 'app/entities/enumerations/status.model';
import { ContractOwnerTypes } from 'app/entities/enumerations/contract-owner-types.model';
import { ContractAcquiringStatuses } from 'app/entities/enumerations/contract-acquiring-statuses.model';

export interface IContract {
  id: number;
  contractType?: ContractTypes | null;
  contractNumber?: string | null;
  description?: string | null;
  validFrom?: dayjs.Dayjs | null;
  validTo?: dayjs.Dayjs | null;
  status?: Status | null;
  currentAttachmentId?: number | null;
  ownerId?: number | null;
  ownerType?: ContractOwnerTypes | null;
  acquiringStatus?: ContractAcquiringStatuses | null;
}

export type NewContract = Omit<IContract, 'id'> & { id: null };
