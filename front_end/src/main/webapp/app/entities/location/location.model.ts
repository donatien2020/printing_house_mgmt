import dayjs from 'dayjs/esm';
import { ILocationLevel } from 'app/entities/location-level/location-level.model';

export interface ILocation {
  id: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  createdOn?: dayjs.Dayjs | null;
  createdById?: number | null;
  createdByUsername?: string | null;
  updatedById?: number | null;
  updatedByUsername?: string | null;
  updatedOn?: dayjs.Dayjs | null;
  parent?: Pick<ILocation, 'id'|'name'> | null;
  level?: Pick<ILocationLevel, 'id'|'name'> | null;
}

export type NewLocation = Omit<ILocation, 'id'> & { id: null };
