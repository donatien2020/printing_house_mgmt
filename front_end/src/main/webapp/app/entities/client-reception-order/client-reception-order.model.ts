import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { ClientReceptionModes } from 'app/entities/enumerations/client-reception-modes.model';
import { OrderStatuses } from 'app/entities/enumerations/order-statuses.model';
import { InvoicingStatuses } from 'app/entities/enumerations/invoicing-statuses.model';

export interface IClientReceptionOrder {
  id: number;
  orderNumber?: string | null;
  divisionId?: number | null;
  receivedOn?: dayjs.Dayjs | null;
  receptionMode?: ClientReceptionModes | null;
  jobDescription?: string | null;
  totalCost?: number | null;
  totalJobCards?: number | null;
  deliveryDate?: dayjs.Dayjs | null;
  assignedToDivisionNames?: number | null;
  assignedToEmployeeNames?: number | null;
  orderingStatus?: OrderStatuses | null;
  invoicingStatus?: InvoicingStatuses | null;
  client?: Pick<IClient, 'id'> | null;
  assignedToEmployee?: Pick<IEmployee, 'id'> | null;
}

export type NewClientReceptionOrder = Omit<IClientReceptionOrder, 'id'> & { id: null };
