import dayjs from 'dayjs/esm';
import { NotificationTypes } from 'app/entities/enumerations/notification-types.model';
import { NotificationProducts } from 'app/entities/enumerations/notification-products.model';
import { NotificationReceivers } from 'app/entities/enumerations/notification-receivers.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface INotification {
  id: number;
  notificationType?: NotificationTypes | null;
  content?: string | null;
  sentAt?: dayjs.Dayjs | null;
  product?: NotificationProducts | null;
  receiverId?: number | null;
  receiverNames?: number | null;
  receiverEmail?: string | null;
  receiverType?: NotificationReceivers | null;
  status?: Status | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
