import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../p-organization.test-samples';

import { POrganizationFormService } from './p-organization-form.service';

describe('POrganization Form Service', () => {
  let service: POrganizationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POrganizationFormService);
  });

  describe('Service methods', () => {
    describe('createPOrganizationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPOrganizationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            officeAddress: expect.any(Object),
            description: expect.any(Object),
            profileID: expect.any(Object),
            companyType: expect.any(Object),
            status: expect.any(Object),
            company: expect.any(Object),
            officeLocation: expect.any(Object),
            parent: expect.any(Object),
          })
        );
      });

      it('passing IPOrganization should create a new form with FormGroup', () => {
        const formGroup = service.createPOrganizationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            officeAddress: expect.any(Object),
            description: expect.any(Object),
            profileID: expect.any(Object),
            companyType: expect.any(Object),
            status: expect.any(Object),
            company: expect.any(Object),
            officeLocation: expect.any(Object),
            parent: expect.any(Object),
          })
        );
      });
    });

    describe('getPOrganization', () => {
      it('should return NewPOrganization for default POrganization initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPOrganizationFormGroup(sampleWithNewData);

        const pOrganization = service.getPOrganization(formGroup) as any;

        expect(pOrganization).toMatchObject(sampleWithNewData);
      });

      it('should return NewPOrganization for empty POrganization initial value', () => {
        const formGroup = service.createPOrganizationFormGroup();

        const pOrganization = service.getPOrganization(formGroup) as any;

        expect(pOrganization).toMatchObject({});
      });

      it('should return IPOrganization', () => {
        const formGroup = service.createPOrganizationFormGroup(sampleWithRequiredData);

        const pOrganization = service.getPOrganization(formGroup) as any;

        expect(pOrganization).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPOrganization should not enable id FormControl', () => {
        const formGroup = service.createPOrganizationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPOrganization should disable id FormControl', () => {
        const formGroup = service.createPOrganizationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
