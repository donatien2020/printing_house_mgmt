import { Status } from 'app/entities/enumerations/status.model';

import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 32440,
  companyNames: 'Djibouti Washington',
  tinNumber: 'Awesome Avon Avon',
};

export const sampleWithPartialData: ICompany = {
  id: 56983,
  companyNames: 'Tenge Intelligent',
  tinNumber: 'Falkland',
};

export const sampleWithFullData: ICompany = {
  id: 17780,
  companyNames: 'intermediate',
  tinNumber: 'Vision-oriented',
  description: 'Organized Granite',
  status: Status['DELETED'],
};

export const sampleWithNewData: NewCompany = {
  companyNames: 'transition',
  tinNumber: 'withdrawal Tala payment',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
