import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../location-level.test-samples';

import { LocationLevelFormService } from './location-level-form.service';

describe('LocationLevel Form Service', () => {
  let service: LocationLevelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationLevelFormService);
  });

  describe('Service methods', () => {
    describe('createLocationLevelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLocationLevelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            createdOn: expect.any(Object),
            createdById: expect.any(Object),
            createdByUsername: expect.any(Object),
            updatedById: expect.any(Object),
            updatedByUsername: expect.any(Object),
            updatedOn: expect.any(Object),
          })
        );
      });

      it('passing ILocationLevel should create a new form with FormGroup', () => {
        const formGroup = service.createLocationLevelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            createdOn: expect.any(Object),
            createdById: expect.any(Object),
            createdByUsername: expect.any(Object),
            updatedById: expect.any(Object),
            updatedByUsername: expect.any(Object),
            updatedOn: expect.any(Object),
          })
        );
      });
    });

    describe('getLocationLevel', () => {
      it('should return NewLocationLevel for default LocationLevel initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLocationLevelFormGroup(sampleWithNewData);

        const locationLevel = service.getLocationLevel(formGroup) as any;

        expect(locationLevel).toMatchObject(sampleWithNewData);
      });

      it('should return NewLocationLevel for empty LocationLevel initial value', () => {
        const formGroup = service.createLocationLevelFormGroup();

        const locationLevel = service.getLocationLevel(formGroup) as any;

        expect(locationLevel).toMatchObject({});
      });

      it('should return ILocationLevel', () => {
        const formGroup = service.createLocationLevelFormGroup(sampleWithRequiredData);

        const locationLevel = service.getLocationLevel(formGroup) as any;

        expect(locationLevel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILocationLevel should not enable id FormControl', () => {
        const formGroup = service.createLocationLevelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLocationLevel should disable id FormControl', () => {
        const formGroup = service.createLocationLevelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
