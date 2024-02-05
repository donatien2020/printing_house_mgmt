import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../division.test-samples';

import { DivisionFormService } from './division-form.service';

describe('Division Form Service', () => {
  let service: DivisionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivisionFormService);
  });

  describe('Service methods', () => {
    describe('createDivisionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDivisionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            level: expect.any(Object),
            divisionType: expect.any(Object),
            status: expect.any(Object),
            parent: expect.any(Object),
            organization: expect.any(Object),
          })
        );
      });

      it('passing IDivision should create a new form with FormGroup', () => {
        const formGroup = service.createDivisionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            level: expect.any(Object),
            divisionType: expect.any(Object),
            status: expect.any(Object),
            parent: expect.any(Object),
            organization: expect.any(Object),
          })
        );
      });
    });

    describe('getDivision', () => {
      it('should return NewDivision for default Division initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDivisionFormGroup(sampleWithNewData);

        const division = service.getDivision(formGroup) as any;

        expect(division).toMatchObject(sampleWithNewData);
      });

      it('should return NewDivision for empty Division initial value', () => {
        const formGroup = service.createDivisionFormGroup();

        const division = service.getDivision(formGroup) as any;

        expect(division).toMatchObject({});
      });

      it('should return IDivision', () => {
        const formGroup = service.createDivisionFormGroup(sampleWithRequiredData);

        const division = service.getDivision(formGroup) as any;

        expect(division).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDivision should not enable id FormControl', () => {
        const formGroup = service.createDivisionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDivision should disable id FormControl', () => {
        const formGroup = service.createDivisionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
