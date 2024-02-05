import dayjs from 'dayjs/esm';

export interface ILocationLevel {
  id: number;
  code?: string | null;
  name?: string | null;
  createdOn?: dayjs.Dayjs | null;
  createdById?: number | null;
  createdByUsername?: string | null;
  updatedById?: number | null;
  updatedByUsername?: string | null;
  updatedOn?: dayjs.Dayjs | null;
}

export type NewLocationLevel = Omit<ILocationLevel, 'id'> & { id: null };
