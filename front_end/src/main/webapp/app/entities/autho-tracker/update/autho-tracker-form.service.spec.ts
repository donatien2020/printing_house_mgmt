import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../autho-tracker.test-samples';

import { AuthoTrackerFormService } from './autho-tracker-form.service';

describe('AuthoTracker Form Service', () => {
  let service: AuthoTrackerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthoTrackerFormService);
  });

  describe('Service methods', () => {
    describe('createAuthoTrackerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAuthoTrackerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            token: expect.any(Object),
            status: expect.any(Object),
            logedInOn: expect.any(Object),
          })
        );
      });

      it('passing IAuthoTracker should create a new form with FormGroup', () => {
        const formGroup = service.createAuthoTrackerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            token: expect.any(Object),
            status: expect.any(Object),
            logedInOn: expect.any(Object),
          })
        );
      });
    });

    describe('getAuthoTracker', () => {
      it('should return NewAuthoTracker for default AuthoTracker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAuthoTrackerFormGroup(sampleWithNewData);

        const authoTracker = service.getAuthoTracker(formGroup) as any;

        expect(authoTracker).toMatchObject(sampleWithNewData);
      });

      it('should return NewAuthoTracker for empty AuthoTracker initial value', () => {
        const formGroup = service.createAuthoTrackerFormGroup();

        const authoTracker = service.getAuthoTracker(formGroup) as any;

        expect(authoTracker).toMatchObject({});
      });

      it('should return IAuthoTracker', () => {
        const formGroup = service.createAuthoTrackerFormGroup(sampleWithRequiredData);

        const authoTracker = service.getAuthoTracker(formGroup) as any;

        expect(authoTracker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAuthoTracker should not enable id FormControl', () => {
        const formGroup = service.createAuthoTrackerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAuthoTracker should disable id FormControl', () => {
        const formGroup = service.createAuthoTrackerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
