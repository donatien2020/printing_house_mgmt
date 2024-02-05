import { FileTypes } from 'app/entities/enumerations/file-types.model';
import { FileExtensions } from 'app/entities/enumerations/file-extensions.model';
import { FileOwnerTypes } from 'app/entities/enumerations/file-owner-types.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IAttachment {
  id: number;
  description?: string | null;
  fileName?: string | null;
  pathToFile?: string | null;
  type?: FileTypes | null;
  extension?: FileExtensions | null;
  ownerType?: FileOwnerTypes | null;
  ownerId?: number | null;
  status?: Status | null;
}

export type NewAttachment = Omit<IAttachment, 'id'> & { id: null };
