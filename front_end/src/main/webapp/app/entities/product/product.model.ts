import { Status } from 'app/entities/enumerations/status.model';
import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';


export interface IProduct {
  id: number;
  categoryName?: string | null;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  unitSalesPrice?: number | null;
  unitPurchaseCost?: number | null;
  status?: keyof typeof Status | null;
  category?: Pick<IProductCategory, 'id'|'name'> | null;
  organization?: Pick<IPOrganization, 'id'|'description'> | null;
}
export type NewProduct = Omit<IProduct, 'id'> & { id: null };
