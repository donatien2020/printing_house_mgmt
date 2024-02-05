import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAuthoTracker } from '../autho-tracker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../autho-tracker.test-samples';

import { AuthoTrackerService, RestAuthoTracker } from './autho-tracker.service';

const requireRestSample: RestAuthoTracker = {
  ...sampleWithRequiredData,
  logedInOn: sampleWithRequiredData.logedInOn?.toJSON(),
};

describe('AuthoTracker Service', () => {
  let service: AuthoTrackerService;
  let httpMock: HttpTestingController;
  let expectedResult: IAuthoTracker | IAuthoTracker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AuthoTrackerService);
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

    it('should create a AuthoTracker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const authoTracker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(authoTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AuthoTracker', () => {
      const authoTracker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(authoTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AuthoTracker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AuthoTracker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AuthoTracker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAuthoTrackerToCollectionIfMissing', () => {
      it('should add a AuthoTracker to an empty array', () => {
        const authoTracker: IAuthoTracker = sampleWithRequiredData;
        expectedResult = service.addAuthoTrackerToCollectionIfMissing([], authoTracker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authoTracker);
      });

      it('should not add a AuthoTracker to an array that contains it', () => {
        const authoTracker: IAuthoTracker = sampleWithRequiredData;
        const authoTrackerCollection: IAuthoTracker[] = [
          {
            ...authoTracker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAuthoTrackerToCollectionIfMissing(authoTrackerCollection, authoTracker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AuthoTracker to an array that doesn't contain it", () => {
        const authoTracker: IAuthoTracker = sampleWithRequiredData;
        const authoTrackerCollection: IAuthoTracker[] = [sampleWithPartialData];
        expectedResult = service.addAuthoTrackerToCollectionIfMissing(authoTrackerCollection, authoTracker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authoTracker);
      });

      it('should add only unique AuthoTracker to an array', () => {
        const authoTrackerArray: IAuthoTracker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const authoTrackerCollection: IAuthoTracker[] = [sampleWithRequiredData];
        expectedResult = service.addAuthoTrackerToCollectionIfMissing(authoTrackerCollection, ...authoTrackerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const authoTracker: IAuthoTracker = sampleWithRequiredData;
        const authoTracker2: IAuthoTracker = sampleWithPartialData;
        expectedResult = service.addAuthoTrackerToCollectionIfMissing([], authoTracker, authoTracker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authoTracker);
        expect(expectedResult).toContain(authoTracker2);
      });

      it('should accept null and undefined values', () => {
        const authoTracker: IAuthoTracker = sampleWithRequiredData;
        expectedResult = service.addAuthoTrackerToCollectionIfMissing([], null, authoTracker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authoTracker);
      });

      it('should return initial array if no AuthoTracker is added', () => {
        const authoTrackerCollection: IAuthoTracker[] = [sampleWithRequiredData];
        expectedResult = service.addAuthoTrackerToCollectionIfMissing(authoTrackerCollection, undefined, null);
        expect(expectedResult).toEqual(authoTrackerCollection);
      });
    });

    describe('compareAuthoTracker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAuthoTracker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAuthoTracker(entity1, entity2);
        const compareResult2 = service.compareAuthoTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAuthoTracker(entity1, entity2);
        const compareResult2 = service.compareAuthoTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAuthoTracker(entity1, entity2);
        const compareResult2 = service.compareAuthoTracker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
