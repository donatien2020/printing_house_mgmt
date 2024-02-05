import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pay-roll.test-samples';

import { PayRollFormService } from './pay-roll-form.service';

describe('PayRoll Form Service', () => {
  let service: PayRollFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayRollFormService);
  });

  describe('Service methods', () => {
    describe('createPayRollFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPayRollFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            organizationId: expect.any(Object),
            payFrom: expect.any(Object),
            payTo: expect.any(Object),
            status: expect.any(Object),
            totalGrossAmount: expect.any(Object),
            totalNetAmount: expect.any(Object),
          })
        );
      });

      it('passing IPayRoll should create a new form with FormGroup', () => {
        const formGroup = service.createPayRollFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            organizationId: expect.any(Object),
            payFrom: expect.any(Object),
            payTo: expect.any(Object),
            status: expect.any(Object),
            totalGrossAmount: expect.any(Object),
            totalNetAmount: expect.any(Object),
          })
        );
      });
    });

    describe('getPayRoll', () => {
      it('should return NewPayRoll for default PayRoll initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPayRollFormGroup(sampleWithNewData);

        const payRoll = service.getPayRoll(formGroup) as any;

        expect(payRoll).toMatchObject(sampleWithNewData);
      });

      it('should return NewPayRoll for empty PayRoll initial value', () => {
        const formGroup = service.createPayRollFormGroup();

        const payRoll = service.getPayRoll(formGroup) as any;

        expect(payRoll).toMatchObject({});
      });

      it('should return IPayRoll', () => {
        const formGroup = service.createPayRollFormGroup(sampleWithRequiredData);

        const payRoll = service.getPayRoll(formGroup) as any;

        expect(payRoll).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPayRoll should not enable id FormControl', () => {
        const formGroup = service.createPayRollFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPayRoll should disable id FormControl', () => {
        const formGroup = service.createPayRollFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
