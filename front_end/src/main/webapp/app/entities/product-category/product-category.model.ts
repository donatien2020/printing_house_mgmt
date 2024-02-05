import { Status } from 'app/entities/enumerations/status.model';

export interface IProductCategory {
  id: number;
  name?: string | null;
  description?: string | null;
  statu?: Status | null;
  parentName?: string | null;
  parent?: Pick<IProductCategory, 'id'| 'name'> | null;
}

export type NewProductCategory = Omit<IProductCategory, 'id'> & { id: null };
