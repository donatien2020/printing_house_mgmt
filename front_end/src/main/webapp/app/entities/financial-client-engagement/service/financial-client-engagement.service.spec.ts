import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFinancialClientEngagement } from '../financial-client-engagement.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../financial-client-engagement.test-samples';

import { FinancialClientEngagementService } from './financial-client-engagement.service';

const requireRestSample: IFinancialClientEngagement = {
  ...sampleWithRequiredData,
};

describe('FinancialClientEngagement Service', () => {
  let service: FinancialClientEngagementService;
  let httpMock: HttpTestingController;
  let expectedResult: IFinancialClientEngagement | IFinancialClientEngagement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FinancialClientEngagementService);
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

    it('should create a FinancialClientEngagement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const financialClientEngagement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(financialClientEngagement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FinancialClientEngagement', () => {
      const financialClientEngagement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(financialClientEngagement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FinancialClientEngagement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FinancialClientEngagement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FinancialClientEngagement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFinancialClientEngagementToCollectionIfMissing', () => {
      it('should add a FinancialClientEngagement to an empty array', () => {
        const financialClientEngagement: IFinancialClientEngagement = sampleWithRequiredData;
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing([], financialClientEngagement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialClientEngagement);
      });

      it('should not add a FinancialClientEngagement to an array that contains it', () => {
        const financialClientEngagement: IFinancialClientEngagement = sampleWithRequiredData;
        const financialClientEngagementCollection: IFinancialClientEngagement[] = [
          {
            ...financialClientEngagement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing(
          financialClientEngagementCollection,
          financialClientEngagement
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FinancialClientEngagement to an array that doesn't contain it", () => {
        const financialClientEngagement: IFinancialClientEngagement = sampleWithRequiredData;
        const financialClientEngagementCollection: IFinancialClientEngagement[] = [sampleWithPartialData];
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing(
          financialClientEngagementCollection,
          financialClientEngagement
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialClientEngagement);
      });

      it('should add only unique FinancialClientEngagement to an array', () => {
        const financialClientEngagementArray: IFinancialClientEngagement[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const financialClientEngagementCollection: IFinancialClientEngagement[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing(
          financialClientEngagementCollection,
          ...financialClientEngagementArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const financialClientEngagement: IFinancialClientEngagement = sampleWithRequiredData;
        const financialClientEngagement2: IFinancialClientEngagement = sampleWithPartialData;
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing(
          [],
          financialClientEngagement,
          financialClientEngagement2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialClientEngagement);
        expect(expectedResult).toContain(financialClientEngagement2);
      });

      it('should accept null and undefined values', () => {
        const financialClientEngagement: IFinancialClientEngagement = sampleWithRequiredData;
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing([], null, financialClientEngagement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialClientEngagement);
      });

      it('should return initial array if no FinancialClientEngagement is added', () => {
        const financialClientEngagementCollection: IFinancialClientEngagement[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialClientEngagementToCollectionIfMissing(financialClientEngagementCollection, undefined, null);
        expect(expectedResult).toEqual(financialClientEngagementCollection);
      });
    });

    describe('compareFinancialClientEngagement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFinancialClientEngagement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFinancialClientEngagement(entity1, entity2);
        const compareResult2 = service.compareFinancialClientEngagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFinancialClientEngagement(entity1, entity2);
        const compareResult2 = service.compareFinancialClientEngagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFinancialClientEngagement(entity1, entity2);
        const compareResult2 = service.compareFinancialClientEngagement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
