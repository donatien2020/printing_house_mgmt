import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../client.test-samples';

import { ClientFormService } from './client-form.service';

describe('Client Form Service', () => {
  let service: ClientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFormService);
  });

  describe('Service methods', () => {
    describe('createClientFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientType: expect.any(Object),
            engagementMode: expect.any(Object),
            address: expect.any(Object),
            currentContractId: expect.any(Object),
            contactPhoneNumber: expect.any(Object),
            organizationId: expect.any(Object),
            person: expect.any(Object),
            company: expect.any(Object),
            residenceLocation: expect.any(Object),
          })
        );
      });

      it('passing IClient should create a new form with FormGroup', () => {
        const formGroup = service.createClientFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientType: expect.any(Object),
            engagementMode: expect.any(Object),
            address: expect.any(Object),
            currentContractId: expect.any(Object),
            contactPhoneNumber: expect.any(Object),
            organizationId: expect.any(Object),
            person: expect.any(Object),
            company: expect.any(Object),
            residenceLocation: expect.any(Object),
          })
        );
      });
    });

    describe('getClient', () => {
      it('should return NewClient for default Client initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClientFormGroup(sampleWithNewData);

        const client = service.getClient(formGroup) as any;

        expect(client).toMatchObject(sampleWithNewData);
      });

      it('should return NewClient for empty Client initial value', () => {
        const formGroup = service.createClientFormGroup();

        const client = service.getClient(formGroup) as any;

        expect(client).toMatchObject({});
      });

      it('should return IClient', () => {
        const formGroup = service.createClientFormGroup(sampleWithRequiredData);

        const client = service.getClient(formGroup) as any;

        expect(client).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClient should not enable id FormControl', () => {
        const formGroup = service.createClientFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClient should disable id FormControl', () => {
        const formGroup = service.createClientFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
