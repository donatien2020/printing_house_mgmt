import dayjs from 'dayjs/esm';
import { IClientReceptionOrder } from 'app/entities/client-reception-order/client-reception-order.model';
import { PerformanceMeasures } from 'app/entities/enumerations/performance-measures.model';
import { JobCardStatuses } from 'app/entities/enumerations/job-card-statuses.model';

export interface IJobCard {
  id: number;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  startedOn?: dayjs.Dayjs | null;
  completedOn?: dayjs.Dayjs | null;
  divisionId?: number | null;
  divisionName?: number | null;
  performance?: PerformanceMeasures | null;
  status?: JobCardStatuses | null;
  clientReceptionOrder?: Pick<IClientReceptionOrder, 'id'|'orderNumber'> | null;
}

export type NewJobCard = Omit<IJobCard, 'id'> & { id: null };
