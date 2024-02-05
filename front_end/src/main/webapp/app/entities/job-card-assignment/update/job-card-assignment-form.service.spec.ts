import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../job-card-assignment.test-samples';

import { JobCardAssignmentFormService } from './job-card-assignment-form.service';

describe('JobCardAssignment Form Service', () => {
  let service: JobCardAssignmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCardAssignmentFormService);
  });

  describe('Service methods', () => {
    describe('createJobCardAssignmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobCardAssignmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            assignedToId: expect.any(Object),
            assignedNames: expect.any(Object),
            description: expect.any(Object),
            assignmentMode: expect.any(Object),
            status: expect.any(Object),
            jobCard: expect.any(Object),
          })
        );
      });

      it('passing IJobCardAssignment should create a new form with FormGroup', () => {
        const formGroup = service.createJobCardAssignmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            assignedToId: expect.any(Object),
            assignedNames: expect.any(Object),
            description: expect.any(Object),
            assignmentMode: expect.any(Object),
            status: expect.any(Object),
            jobCard: expect.any(Object),
          })
        );
      });
    });

    describe('getJobCardAssignment', () => {
      it('should return NewJobCardAssignment for default JobCardAssignment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJobCardAssignmentFormGroup(sampleWithNewData);

        const jobCardAssignment = service.getJobCardAssignment(formGroup) as any;

        expect(jobCardAssignment).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobCardAssignment for empty JobCardAssignment initial value', () => {
        const formGroup = service.createJobCardAssignmentFormGroup();

        const jobCardAssignment = service.getJobCardAssignment(formGroup) as any;

        expect(jobCardAssignment).toMatchObject({});
      });

      it('should return IJobCardAssignment', () => {
        const formGroup = service.createJobCardAssignmentFormGroup(sampleWithRequiredData);

        const jobCardAssignment = service.getJobCardAssignment(formGroup) as any;

        expect(jobCardAssignment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobCardAssignment should not enable id FormControl', () => {
        const formGroup = service.createJobCardAssignmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobCardAssignment should disable id FormControl', () => {
        const formGroup = service.createJobCardAssignmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
