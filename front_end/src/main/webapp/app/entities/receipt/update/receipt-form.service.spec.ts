import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../receipt.test-samples';

import { ReceiptFormService } from './receipt-form.service';

describe('Receipt Form Service', () => {
  let service: ReceiptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptFormService);
  });

  describe('Service methods', () => {
    describe('createReceiptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReceiptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            totalCost: expect.any(Object),
            totalPaid: expect.any(Object),
            balance: expect.any(Object),
            paymentDate: expect.any(Object),
            receivedByNames: expect.any(Object),
          })
        );
      });

      it('passing IReceipt should create a new form with FormGroup', () => {
        const formGroup = service.createReceiptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            totalCost: expect.any(Object),
            totalPaid: expect.any(Object),
            balance: expect.any(Object),
            paymentDate: expect.any(Object),
            receivedByNames: expect.any(Object),
          })
        );
      });
    });

    describe('getReceipt', () => {
      it('should return NewReceipt for default Receipt initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createReceiptFormGroup(sampleWithNewData);

        const receipt = service.getReceipt(formGroup) as any;

        expect(receipt).toMatchObject(sampleWithNewData);
      });

      it('should return NewReceipt for empty Receipt initial value', () => {
        const formGroup = service.createReceiptFormGroup();

        const receipt = service.getReceipt(formGroup) as any;

        expect(receipt).toMatchObject({});
      });

      it('should return IReceipt', () => {
        const formGroup = service.createReceiptFormGroup(sampleWithRequiredData);

        const receipt = service.getReceipt(formGroup) as any;

        expect(receipt).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReceipt should not enable id FormControl', () => {
        const formGroup = service.createReceiptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReceipt should disable id FormControl', () => {
        const formGroup = service.createReceiptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
