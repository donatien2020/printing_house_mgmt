import dayjs from 'dayjs/esm';

import { DocumentTypes } from 'app/entities/enumerations/document-types.model';
import { Genders } from 'app/entities/enumerations/genders.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IPerson, NewPerson } from './person.model';

export const sampleWithRequiredData: IPerson = {
  id: 31094,
  nid: 'Pound Buckinghamshire',
  docType: DocumentTypes['PASSPORT'],
  gender: Genders['MALE'],
  status: Status['ACTIVE'],
};

export const sampleWithPartialData: IPerson = {
  id: 10859,
  nid: 'best-of-breed withdrawal',
  docType: DocumentTypes['NID'],
  gender: Genders['MALE'],
  birthDate: dayjs('2023-10-26'),
  status: Status['ACTIVE'],
};

export const sampleWithFullData: IPerson = {
  id: 70006,
  nid: 'blockchains',
  docType: DocumentTypes['NA'],
  firstName: 'Verla',
  lastName: 'Baumbach',
  gender: Genders['FEMALE'],
  birthDate: dayjs('2023-10-26'),
  birthAddress: 'Chicken',
  status: Status['INACTIVE'],
};

export const sampleWithNewData: NewPerson = {
  nid: 'Pants Universal',
  docType: DocumentTypes['NID'],
  gender: Genders['MALE'],
  status: Status['ACTIVE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
