import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../debtor.test-samples';

import { DebtorFormService } from './debtor-form.service';

describe('Debtor Form Service', () => {
  let service: DebtorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtorFormService);
  });

  describe('Service methods', () => {
    describe('createDebtorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDebtorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            serviceDescription: expect.any(Object),
            productDescription: expect.any(Object),
            debtDate: expect.any(Object),
            debtStatus: expect.any(Object),
            invoicingStatus: expect.any(Object),
            totalAmount: expect.any(Object),
            paidAmount: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });

      it('passing IDebtor should create a new form with FormGroup', () => {
        const formGroup = service.createDebtorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            serviceDescription: expect.any(Object),
            productDescription: expect.any(Object),
            debtDate: expect.any(Object),
            debtStatus: expect.any(Object),
            invoicingStatus: expect.any(Object),
            totalAmount: expect.any(Object),
            paidAmount: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });
    });

    describe('getDebtor', () => {
      it('should return NewDebtor for default Debtor initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDebtorFormGroup(sampleWithNewData);

        const debtor = service.getDebtor(formGroup) as any;

        expect(debtor).toMatchObject(sampleWithNewData);
      });

      it('should return NewDebtor for empty Debtor initial value', () => {
        const formGroup = service.createDebtorFormGroup();

        const debtor = service.getDebtor(formGroup) as any;

        expect(debtor).toMatchObject({});
      });

      it('should return IDebtor', () => {
        const formGroup = service.createDebtorFormGroup(sampleWithRequiredData);

        const debtor = service.getDebtor(formGroup) as any;

        expect(debtor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDebtor should not enable id FormControl', () => {
        const formGroup = service.createDebtorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDebtor should disable id FormControl', () => {
        const formGroup = service.createDebtorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
