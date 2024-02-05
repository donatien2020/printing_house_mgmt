import { DivisionLevels } from 'app/entities/enumerations/division-levels.model';
import { DivisionTypes } from 'app/entities/enumerations/division-types.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IDivision, NewDivision } from './division.model';

export const sampleWithRequiredData: IDivision = {
  id: 46356,
  level: DivisionLevels['DEPARTMENT'],
  divisionType: DivisionTypes['ADMINISTRATION'],
  status: Status['DELETED'],
};

export const sampleWithPartialData: IDivision = {
  id: 31656,
  name: 'Dynamic Regional',
  description: 'Steel Jewelery 24/7',
  level: DivisionLevels['SUB_UNIT'],
  divisionType: DivisionTypes['DELIVERY'],
  status: Status['INACTIVE'],
};

export const sampleWithFullData: IDivision = {
  id: 45040,
  name: 'Belize microchip Gateway',
  description: 'Cambridgeshire grey',
  level: DivisionLevels['SUB_UNIT'],
  divisionType: DivisionTypes['FINANCE'],
  status: Status['INACTIVE'],
};

export const sampleWithNewData: NewDivision = {
  level: DivisionLevels['DEPARTMENT'],
  divisionType: DivisionTypes['RECOVERY'],
  status: Status['INACTIVE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
