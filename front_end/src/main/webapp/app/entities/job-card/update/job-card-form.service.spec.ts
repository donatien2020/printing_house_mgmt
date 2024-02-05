import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../job-card.test-samples';

import { JobCardFormService } from './job-card-form.service';

describe('JobCard Form Service', () => {
  let service: JobCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCardFormService);
  });

  describe('Service methods', () => {
    describe('createJobCardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobCardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            startedOn: expect.any(Object),
            completedOn: expect.any(Object),
            divisionId: expect.any(Object),
            divisionName: expect.any(Object),
            performance: expect.any(Object),
            status: expect.any(Object),
            clientReceptionOrder: expect.any(Object),
          })
        );
      });

      it('passing IJobCard should create a new form with FormGroup', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            startedOn: expect.any(Object),
            completedOn: expect.any(Object),
            divisionId: expect.any(Object),
            divisionName: expect.any(Object),
            performance: expect.any(Object),
            status: expect.any(Object),
            clientReceptionOrder: expect.any(Object),
          })
        );
      });
    });

    describe('getJobCard', () => {
      it('should return NewJobCard for default JobCard initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJobCardFormGroup(sampleWithNewData);

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobCard for empty JobCard initial value', () => {
        const formGroup = service.createJobCardFormGroup();

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject({});
      });

      it('should return IJobCard', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobCard should not enable id FormControl', () => {
        const formGroup = service.createJobCardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobCard should disable id FormControl', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
