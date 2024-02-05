import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../financial-client-engagement.test-samples';

import { FinancialClientEngagementFormService } from './financial-client-engagement-form.service';

describe('FinancialClientEngagement Form Service', () => {
  let service: FinancialClientEngagementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialClientEngagementFormService);
  });

  describe('Service methods', () => {
    describe('createFinancialClientEngagementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            clientId: expect.any(Object),
            clientNames: expect.any(Object),
            discussionSummary: expect.any(Object),
            reason: expect.any(Object),
            conclusion: expect.any(Object),
            contractId: expect.any(Object),
          })
        );
      });

      it('passing IFinancialClientEngagement should create a new form with FormGroup', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            clientId: expect.any(Object),
            clientNames: expect.any(Object),
            discussionSummary: expect.any(Object),
            reason: expect.any(Object),
            conclusion: expect.any(Object),
            contractId: expect.any(Object),
          })
        );
      });
    });

    describe('getFinancialClientEngagement', () => {
      it('should return NewFinancialClientEngagement for default FinancialClientEngagement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFinancialClientEngagementFormGroup(sampleWithNewData);

        const financialClientEngagement = service.getFinancialClientEngagement(formGroup) as any;

        expect(financialClientEngagement).toMatchObject(sampleWithNewData);
      });

      it('should return NewFinancialClientEngagement for empty FinancialClientEngagement initial value', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup();

        const financialClientEngagement = service.getFinancialClientEngagement(formGroup) as any;

        expect(financialClientEngagement).toMatchObject({});
      });

      it('should return IFinancialClientEngagement', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup(sampleWithRequiredData);

        const financialClientEngagement = service.getFinancialClientEngagement(formGroup) as any;

        expect(financialClientEngagement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFinancialClientEngagement should not enable id FormControl', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFinancialClientEngagement should disable id FormControl', () => {
        const formGroup = service.createFinancialClientEngagementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
