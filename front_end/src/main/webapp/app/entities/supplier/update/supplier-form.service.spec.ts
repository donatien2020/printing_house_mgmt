import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../supplier.test-samples';

import { SupplierFormService } from './supplier-form.service';

describe('Supplier Form Service', () => {
  let service: SupplierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierFormService);
  });

  describe('Service methods', () => {
    describe('createSupplierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSupplierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            address: expect.any(Object),
            phoneNumber: expect.any(Object),
            description: expect.any(Object),
            specialization: expect.any(Object),
            status: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });

      it('passing ISupplier should create a new form with FormGroup', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            address: expect.any(Object),
            phoneNumber: expect.any(Object),
            description: expect.any(Object),
            specialization: expect.any(Object),
            status: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });
    });

    describe('getSupplier', () => {
      it('should return NewSupplier for default Supplier initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSupplierFormGroup(sampleWithNewData);

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject(sampleWithNewData);
      });

      it('should return NewSupplier for empty Supplier initial value', () => {
        const formGroup = service.createSupplierFormGroup();

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject({});
      });

      it('should return ISupplier', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISupplier should not enable id FormControl', () => {
        const formGroup = service.createSupplierFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSupplier should disable id FormControl', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
