import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../client-reception-order.test-samples';

import { ClientReceptionOrderFormService } from './client-reception-order-form.service';

describe('ClientReceptionOrder Form Service', () => {
  let service: ClientReceptionOrderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientReceptionOrderFormService);
  });

  describe('Service methods', () => {
    describe('createClientReceptionOrderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientReceptionOrderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderNumber: expect.any(Object),
            divisionId: expect.any(Object),
            receivedOn: expect.any(Object),
            receptionMode: expect.any(Object),
            jobDescription: expect.any(Object),
            totalCost: expect.any(Object),
            totalJobCards: expect.any(Object),
            deliveryDate: expect.any(Object),
            assignedToDivisionNames: expect.any(Object),
            assignedToEmployeeNames: expect.any(Object),
            orderingStatus: expect.any(Object),
            invoicingStatus: expect.any(Object),
            client: expect.any(Object),
            assignedToEmployee: expect.any(Object),
          })
        );
      });

      it('passing IClientReceptionOrder should create a new form with FormGroup', () => {
        const formGroup = service.createClientReceptionOrderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderNumber: expect.any(Object),
            divisionId: expect.any(Object),
            receivedOn: expect.any(Object),
            receptionMode: expect.any(Object),
            jobDescription: expect.any(Object),
            totalCost: expect.any(Object),
            totalJobCards: expect.any(Object),
            deliveryDate: expect.any(Object),
            assignedToDivisionNames: expect.any(Object),
            assignedToEmployeeNames: expect.any(Object),
            orderingStatus: expect.any(Object),
            invoicingStatus: expect.any(Object),
            client: expect.any(Object),
            assignedToEmployee: expect.any(Object),
          })
        );
      });
    });

    describe('getClientReceptionOrder', () => {
      it('should return NewClientReceptionOrder for default ClientReceptionOrder initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClientReceptionOrderFormGroup(sampleWithNewData);

        const clientReceptionOrder = service.getClientReceptionOrder(formGroup) as any;

        expect(clientReceptionOrder).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientReceptionOrder for empty ClientReceptionOrder initial value', () => {
        const formGroup = service.createClientReceptionOrderFormGroup();

        const clientReceptionOrder = service.getClientReceptionOrder(formGroup) as any;

        expect(clientReceptionOrder).toMatchObject({});
      });

      it('should return IClientReceptionOrder', () => {
        const formGroup = service.createClientReceptionOrderFormGroup(sampleWithRequiredData);

        const clientReceptionOrder = service.getClientReceptionOrder(formGroup) as any;

        expect(clientReceptionOrder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClientReceptionOrder should not enable id FormControl', () => {
        const formGroup = service.createClientReceptionOrderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientReceptionOrder should disable id FormControl', () => {
        const formGroup = service.createClientReceptionOrderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
