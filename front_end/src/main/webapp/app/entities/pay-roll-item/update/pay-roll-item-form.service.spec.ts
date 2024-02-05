import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pay-roll-item.test-samples';

import { PayRollItemFormService } from './pay-roll-item-form.service';

describe('PayRollItem Form Service', () => {
  let service: PayRollItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayRollItemFormService);
  });

  describe('Service methods', () => {
    describe('createPayRollItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPayRollItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            divisionId: expect.any(Object),
            empId: expect.any(Object),
            empNumber: expect.any(Object),
            netAmount: expect.any(Object),
            grossAmount: expect.any(Object),
            collectionStatus: expect.any(Object),
            collectionDate: expect.any(Object),
            computationDate: expect.any(Object),
            payRoll: expect.any(Object),
          })
        );
      });

      it('passing IPayRollItem should create a new form with FormGroup', () => {
        const formGroup = service.createPayRollItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            divisionId: expect.any(Object),
            empId: expect.any(Object),
            empNumber: expect.any(Object),
            netAmount: expect.any(Object),
            grossAmount: expect.any(Object),
            collectionStatus: expect.any(Object),
            collectionDate: expect.any(Object),
            computationDate: expect.any(Object),
            payRoll: expect.any(Object),
          })
        );
      });
    });

    describe('getPayRollItem', () => {
      it('should return NewPayRollItem for default PayRollItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPayRollItemFormGroup(sampleWithNewData);

        const payRollItem = service.getPayRollItem(formGroup) as any;

        expect(payRollItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewPayRollItem for empty PayRollItem initial value', () => {
        const formGroup = service.createPayRollItemFormGroup();

        const payRollItem = service.getPayRollItem(formGroup) as any;

        expect(payRollItem).toMatchObject({});
      });

      it('should return IPayRollItem', () => {
        const formGroup = service.createPayRollItemFormGroup(sampleWithRequiredData);

        const payRollItem = service.getPayRollItem(formGroup) as any;

        expect(payRollItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPayRollItem should not enable id FormControl', () => {
        const formGroup = service.createPayRollItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPayRollItem should disable id FormControl', () => {
        const formGroup = service.createPayRollItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
