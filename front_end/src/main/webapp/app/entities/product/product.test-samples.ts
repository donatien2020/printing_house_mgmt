import { Status } from 'app/entities/enumerations/status.model';

import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 77672,
  organizationId: 25019,
  categoryName: 'parsing',
  code: 'Brand Programmable',
  name: 'Bedfordshire',
  description: 'Table Health',
  unitSalesPrice: 76905,
  unitPurchaseCost: 66440,
  status: Status['DELETED'],
};

export const sampleWithPartialData: IProduct = {
  id: 80167,
  organizationId: 62539,
  categoryName: 'District',
  code: 'Garden Customer-focused Island',
  name: 'mission-critical',
  description: 'silver',
  unitSalesPrice: 19060,
  unitPurchaseCost: 67547,
  status: Status['ACTIVE'],
};

export const sampleWithFullData: IProduct = {
  id: 33693,
  organizationId: 36230,
  categoryName: 'Gabon',
  code: 'neural frictionless payment',
  name: 'bypass',
  description: 'structure lime',
  unitSalesPrice: 44267,
  unitPurchaseCost: 41457,
  status: Status['INACTIVE'],
};

export const sampleWithNewData: NewProduct = {
  organizationId: 36278,
  categoryName: 'Palestinian Universal',
  code: 'alarm compressing',
  name: 'compress Franc',
  description: 'pixel Pound copy',
  unitSalesPrice: 62414,
  unitPurchaseCost: 17196,
  status: Status['DELETED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
