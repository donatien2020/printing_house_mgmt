import dayjs from 'dayjs/esm';
import { ILocation } from 'app/entities/location/location.model';
import { DocumentTypes } from 'app/entities/enumerations/document-types.model';
import { Genders } from 'app/entities/enumerations/genders.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IPerson {
  id: number;
  nid?: string | null;
  docType?: DocumentTypes | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: Genders | null;
  birthDate?: dayjs.Dayjs | null;
  birthAddress?: string | null;
  status?: Status | null;
  birthLocation?: Pick<ILocation, 'id'> | null;
}

export type NewPerson = Omit<IPerson, 'id'> & { id: null };
