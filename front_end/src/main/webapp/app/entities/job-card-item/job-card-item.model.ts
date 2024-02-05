import { IJobCard } from 'app/entities/job-card/job-card.model';
import { IProduct } from 'app/entities/product/product.model';
import { JobCardItemStatuses } from 'app/entities/enumerations/job-card-item-statuses.model';

export interface IJobCardItem {
  id: number;
  quantity?: number | null;
  unitPrice?: number | null;
  status?: JobCardItemStatuses | null;
  card?: Pick<IJobCard, 'id'|'description'> | null;
  product?: Pick<IProduct, 'id'|'name'> | null;
}

export type NewJobCardItem = Omit<IJobCardItem, 'id'> & { id: null };
