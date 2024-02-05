import dayjs from 'dayjs/esm';

import { NotificationTypes } from 'app/entities/enumerations/notification-types.model';
import { NotificationProducts } from 'app/entities/enumerations/notification-products.model';
import { NotificationReceivers } from 'app/entities/enumerations/notification-receivers.model';
import { Status } from 'app/entities/enumerations/status.model';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
  notificationType: NotificationTypes['E_MAIL'],
  content: 'payment',
  product: NotificationProducts['ACCOUNT'],
  receiverId: 25492,
  receiverNames: 3799,
  receiverEmail: 'Music Djibouti',
  receiverType: NotificationReceivers['USER'],
  status: Status['INACTIVE'],
};

export const sampleWithPartialData: INotification = {
  id: 32606,
  notificationType: NotificationTypes['E_MAIL'],
  content: 'Georgia Swedish Incredible',
  product: NotificationProducts['ACCOUNT'],
  receiverId: 75473,
  receiverNames: 54693,
  receiverEmail: 'Buckinghamshire',
  receiverType: NotificationReceivers['EMPLOYEE'],
  status: Status['DELETED'],
};

export const sampleWithFullData: INotification = {
  id: 62843,
  notificationType: NotificationTypes['E_MAIL'],
  content: 'hacking Wyoming',
  sentAt: dayjs('2023-10-26T12:40'),
  product: NotificationProducts['INVOICE'],
  receiverId: 49277,
  receiverNames: 18987,
  receiverEmail: 'Gorgeous Savings',
  receiverType: NotificationReceivers['ORGANIZATION'],
  status: Status['DELETED'],
};

export const sampleWithNewData: NewNotification = {
  notificationType: NotificationTypes['SMS'],
  content: 'cyan',
  product: NotificationProducts['BILL'],
  receiverId: 1954,
  receiverNames: 1360,
  receiverEmail: 'Berkshire',
  receiverType: NotificationReceivers['CLIENT'],
  status: Status['DELETED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
