import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { DivisionLevels } from 'app/entities/enumerations/division-levels.model';
import { DivisionTypes } from 'app/entities/enumerations/division-types.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IDivision {
  id: number;
  name?: string | null;
  description?: string | null;
  level?: DivisionLevels | null;
  divisionType?: DivisionTypes | null;
  status?: Status | null;
  parent?: Pick<IDivision, 'id' | 'name'> | null;
  organization?: Pick<IPOrganization, 'id' | 'description'> | null;
}

export type NewDivision = Omit<IDivision, 'id'> & { id: null };
