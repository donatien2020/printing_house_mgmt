import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../invoice-history.test-samples';

import { InvoiceHistoryFormService } from './invoice-history-form.service';

describe('InvoiceHistory Form Service', () => {
  let service: InvoiceHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createInvoiceHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvoiceHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            action: expect.any(Object),
            description: expect.any(Object),
            doneOn: expect.any(Object),
          })
        );
      });

      it('passing IInvoiceHistory should create a new form with FormGroup', () => {
        const formGroup = service.createInvoiceHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            action: expect.any(Object),
            description: expect.any(Object),
            doneOn: expect.any(Object),
          })
        );
      });
    });

    describe('getInvoiceHistory', () => {
      it('should return NewInvoiceHistory for default InvoiceHistory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInvoiceHistoryFormGroup(sampleWithNewData);

        const invoiceHistory = service.getInvoiceHistory(formGroup) as any;

        expect(invoiceHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvoiceHistory for empty InvoiceHistory initial value', () => {
        const formGroup = service.createInvoiceHistoryFormGroup();

        const invoiceHistory = service.getInvoiceHistory(formGroup) as any;

        expect(invoiceHistory).toMatchObject({});
      });

      it('should return IInvoiceHistory', () => {
        const formGroup = service.createInvoiceHistoryFormGroup(sampleWithRequiredData);

        const invoiceHistory = service.getInvoiceHistory(formGroup) as any;

        expect(invoiceHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvoiceHistory should not enable id FormControl', () => {
        const formGroup = service.createInvoiceHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvoiceHistory should disable id FormControl', () => {
        const formGroup = service.createInvoiceHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
