import dayjs from 'dayjs/esm';

import { DeliveryStatuses } from 'app/entities/enumerations/delivery-statuses.model';

import { IDelivery, NewDelivery } from './delivery.model';

export const sampleWithRequiredData: IDelivery = {
  id: 76194,
  orderId: 30398,
  orderNumber: 72103,
  delivererId: 14206,
  receiverClientId: 79274,
  status: DeliveryStatuses['DELIVERED'],
};

export const sampleWithPartialData: IDelivery = {
  id: 870,
  orderId: 18248,
  orderNumber: 39066,
  delivererId: 66312,
  receiverClientId: 48174,
  attachmentId: 88907,
  deliveryDate: dayjs('2023-10-25T18:57'),
  deliveryAddress: 'visionary Liaison Tuna',
  deliveryLocationId: 31030,
  status: DeliveryStatuses['DELIVERED'],
};

export const sampleWithFullData: IDelivery = {
  id: 94160,
  orderId: 61121,
  orderNumber: 48831,
  delivererId: 36843,
  deliveryNote: 'Technician system Avon',
  receiverClientId: 75291,
  attachmentId: 38902,
  deliveryDate: dayjs('2023-10-25T23:31'),
  deliveryAddress: 'Granite',
  deliveryLocationId: 82462,
  status: DeliveryStatuses['DELIVERED'],
};

export const sampleWithNewData: NewDelivery = {
  orderId: 3279,
  orderNumber: 91707,
  delivererId: 40516,
  receiverClientId: 94694,
  status: DeliveryStatuses['DELIVERED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
