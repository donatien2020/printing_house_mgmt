import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-division-enrolment.test-samples';

import { UserDivisionEnrolmentFormService } from './user-division-enrolment-form.service';

describe('UserDivisionEnrolment Form Service', () => {
  let service: UserDivisionEnrolmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDivisionEnrolmentFormService);
  });

  describe('Service methods', () => {
    describe('createUserDivisionEnrolmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startedOn: expect.any(Object),
            endedOn: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
            division: expect.any(Object),
          })
        );
      });

      it('passing IUserDivisionEnrolment should create a new form with FormGroup', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startedOn: expect.any(Object),
            endedOn: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
            division: expect.any(Object),
          })
        );
      });
    });

    describe('getUserDivisionEnrolment', () => {
      it('should return NewUserDivisionEnrolment for default UserDivisionEnrolment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserDivisionEnrolmentFormGroup(sampleWithNewData);

        const userDivisionEnrolment = service.getUserDivisionEnrolment(formGroup) as any;

        expect(userDivisionEnrolment).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserDivisionEnrolment for empty UserDivisionEnrolment initial value', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup();

        const userDivisionEnrolment = service.getUserDivisionEnrolment(formGroup) as any;

        expect(userDivisionEnrolment).toMatchObject({});
      });

      it('should return IUserDivisionEnrolment', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup(sampleWithRequiredData);

        const userDivisionEnrolment = service.getUserDivisionEnrolment(formGroup) as any;

        expect(userDivisionEnrolment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserDivisionEnrolment should not enable id FormControl', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserDivisionEnrolment should disable id FormControl', () => {
        const formGroup = service.createUserDivisionEnrolmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
