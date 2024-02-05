import { Status } from 'app/entities/enumerations/status.model';

import { IProductCategory, NewProductCategory } from './product-category.model';

export const sampleWithRequiredData: IProductCategory = {
  id: 39228,
  name: 'invoice Guatemala',
  description: 'SMS',
  statu: Status['ACTIVE'],
};

export const sampleWithPartialData: IProductCategory = {
  id: 78272,
  name: 'Fresh algorithm port',
  description: 'haptic Producer Iran',
  statu: Status['ACTIVE'],
};

export const sampleWithFullData: IProductCategory = {
  id: 68798,
  name: 'Gloves',
  description: 'system Brooks',
  statu: Status['ACTIVE'],
  parentName: 'Checking Account lime',
};

export const sampleWithNewData: NewProductCategory = {
  name: 'Assurance Falkland',
  description: 'Algerian Decentralized',
  statu: Status['DELETED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
