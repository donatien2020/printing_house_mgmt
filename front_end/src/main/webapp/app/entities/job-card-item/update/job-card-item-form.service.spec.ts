import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../job-card-item.test-samples';

import { JobCardItemFormService } from './job-card-item-form.service';

describe('JobCardItem Form Service', () => {
  let service: JobCardItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCardItemFormService);
  });

  describe('Service methods', () => {
    describe('createJobCardItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobCardItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            status: expect.any(Object),
            card: expect.any(Object),
            product: expect.any(Object),
          })
        );
      });

      it('passing IJobCardItem should create a new form with FormGroup', () => {
        const formGroup = service.createJobCardItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            status: expect.any(Object),
            card: expect.any(Object),
            product: expect.any(Object),
          })
        );
      });
    });

    describe('getJobCardItem', () => {
      it('should return NewJobCardItem for default JobCardItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJobCardItemFormGroup(sampleWithNewData);

        const jobCardItem = service.getJobCardItem(formGroup) as any;

        expect(jobCardItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobCardItem for empty JobCardItem initial value', () => {
        const formGroup = service.createJobCardItemFormGroup();

        const jobCardItem = service.getJobCardItem(formGroup) as any;

        expect(jobCardItem).toMatchObject({});
      });

      it('should return IJobCardItem', () => {
        const formGroup = service.createJobCardItemFormGroup(sampleWithRequiredData);

        const jobCardItem = service.getJobCardItem(formGroup) as any;

        expect(jobCardItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobCardItem should not enable id FormControl', () => {
        const formGroup = service.createJobCardItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobCardItem should disable id FormControl', () => {
        const formGroup = service.createJobCardItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
