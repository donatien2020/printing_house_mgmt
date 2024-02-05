import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPOrganization } from '../p-organization.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../p-organization.test-samples';

import { POrganizationService } from './p-organization.service';

const requireRestSample: IPOrganization = {
  ...sampleWithRequiredData,
};

describe('POrganization Service', () => {
  let service: POrganizationService;
  let httpMock: HttpTestingController;
  let expectedResult: IPOrganization | IPOrganization[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(POrganizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a POrganization', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pOrganization = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pOrganization).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a POrganization', () => {
      const pOrganization = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pOrganization).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a POrganization', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of POrganization', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a POrganization', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPOrganizationToCollectionIfMissing', () => {
      it('should add a POrganization to an empty array', () => {
        const pOrganization: IPOrganization = sampleWithRequiredData;
        expectedResult = service.addPOrganizationToCollectionIfMissing([], pOrganization);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pOrganization);
      });

      it('should not add a POrganization to an array that contains it', () => {
        const pOrganization: IPOrganization = sampleWithRequiredData;
        const pOrganizationCollection: IPOrganization[] = [
          {
            ...pOrganization,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPOrganizationToCollectionIfMissing(pOrganizationCollection, pOrganization);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a POrganization to an array that doesn't contain it", () => {
        const pOrganization: IPOrganization = sampleWithRequiredData;
        const pOrganizationCollection: IPOrganization[] = [sampleWithPartialData];
        expectedResult = service.addPOrganizationToCollectionIfMissing(pOrganizationCollection, pOrganization);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pOrganization);
      });

      it('should add only unique POrganization to an array', () => {
        const pOrganizationArray: IPOrganization[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pOrganizationCollection: IPOrganization[] = [sampleWithRequiredData];
        expectedResult = service.addPOrganizationToCollectionIfMissing(pOrganizationCollection, ...pOrganizationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pOrganization: IPOrganization = sampleWithRequiredData;
        const pOrganization2: IPOrganization = sampleWithPartialData;
        expectedResult = service.addPOrganizationToCollectionIfMissing([], pOrganization, pOrganization2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pOrganization);
        expect(expectedResult).toContain(pOrganization2);
      });

      it('should accept null and undefined values', () => {
        const pOrganization: IPOrganization = sampleWithRequiredData;
        expectedResult = service.addPOrganizationToCollectionIfMissing([], null, pOrganization, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pOrganization);
      });

      it('should return initial array if no POrganization is added', () => {
        const pOrganizationCollection: IPOrganization[] = [sampleWithRequiredData];
        expectedResult = service.addPOrganizationToCollectionIfMissing(pOrganizationCollection, undefined, null);
        expect(expectedResult).toEqual(pOrganizationCollection);
      });
    });

    describe('comparePOrganization', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePOrganization(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePOrganization(entity1, entity2);
        const compareResult2 = service.comparePOrganization(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePOrganization(entity1, entity2);
        const compareResult2 = service.comparePOrganization(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePOrganization(entity1, entity2);
        const compareResult2 = service.comparePOrganization(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
