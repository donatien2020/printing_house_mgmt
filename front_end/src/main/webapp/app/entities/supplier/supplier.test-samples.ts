import { Status } from 'app/entities/enumerations/status.model';

import { ISupplier, NewSupplier } from './supplier.model';

export const sampleWithRequiredData: ISupplier = {
  id: 7333,
  address: 'Germany Soap Avon',
  phoneNumber: 'enable Legacy',
  description: 'cyan',
  specialization: 'Future transmitting',
  status: Status['INACTIVE'],
};

export const sampleWithPartialData: ISupplier = {
  id: 89016,
  address: 'index transmit payment',
  phoneNumber: 'Ridges',
  description: 'Keyboard success',
  specialization: 'Indiana',
  status: Status['DELETED'],
};

export const sampleWithFullData: ISupplier = {
  id: 90427,
  address: 'support firewall',
  phoneNumber: 'Zambia Chicken Avon',
  description: 'Cambridgeshire Fantastic Re-contextualized',
  specialization: 'Sleek Plastic Consultant',
  status: Status['ACTIVE'],
};

export const sampleWithNewData: NewSupplier = {
  address: 'Heights Dynamic solution',
  phoneNumber: 'Sausages back-end infrastructures',
  description: 'circuit',
  specialization: 'Borders multi-byte',
  status: Status['INACTIVE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
