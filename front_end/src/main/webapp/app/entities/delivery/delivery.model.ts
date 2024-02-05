import dayjs from 'dayjs/esm';
import { IClientReceptionOrder } from 'app/entities/client-reception-order/client-reception-order.model';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { ILocation } from 'app/entities/location/location.model';
import { DeliveryStatuses } from 'app/entities/enumerations/delivery-statuses.model';

export interface IDelivery {
  id: number;
  orderId?: number | null;
  orderNumber?: number | null;
  delivererId?: number | null;
  deliveryNote?: string | null;
  receiverClientId?: number | null;
  attachmentId?: number | null;
  deliveryDate?: dayjs.Dayjs | null;
  deliveryAddress?: string | null;
  deliveryLocationId?: number | null;
  status?: DeliveryStatuses | null;
  receiptionOrder?: Pick<IClientReceptionOrder, 'id'|'orderNumber'> | null;
  document?: Pick<IAttachment, 'id'|'fileName'> | null;
  location?: Pick<ILocation, 'id'|'name'> | null;
}

export type NewDelivery = Omit<IDelivery, 'id'> & { id: null };
