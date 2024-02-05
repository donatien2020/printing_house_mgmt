import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILocationLevel } from '../location-level.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../location-level.test-samples';

import { LocationLevelService, RestLocationLevel } from './location-level.service';

const requireRestSample: RestLocationLevel = {
  ...sampleWithRequiredData,
  createdOn: sampleWithRequiredData.createdOn?.toJSON(),
  updatedOn: sampleWithRequiredData.updatedOn?.toJSON(),
};

describe('LocationLevel Service', () => {
  let service: LocationLevelService;
  let httpMock: HttpTestingController;
  let expectedResult: ILocationLevel | ILocationLevel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LocationLevelService);
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

    it('should create a LocationLevel', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const locationLevel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(locationLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LocationLevel', () => {
      const locationLevel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(locationLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LocationLevel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LocationLevel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LocationLevel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLocationLevelToCollectionIfMissing', () => {
      it('should add a LocationLevel to an empty array', () => {
        const locationLevel: ILocationLevel = sampleWithRequiredData;
        expectedResult = service.addLocationLevelToCollectionIfMissing([], locationLevel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(locationLevel);
      });

      it('should not add a LocationLevel to an array that contains it', () => {
        const locationLevel: ILocationLevel = sampleWithRequiredData;
        const locationLevelCollection: ILocationLevel[] = [
          {
            ...locationLevel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLocationLevelToCollectionIfMissing(locationLevelCollection, locationLevel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LocationLevel to an array that doesn't contain it", () => {
        const locationLevel: ILocationLevel = sampleWithRequiredData;
        const locationLevelCollection: ILocationLevel[] = [sampleWithPartialData];
        expectedResult = service.addLocationLevelToCollectionIfMissing(locationLevelCollection, locationLevel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(locationLevel);
      });

      it('should add only unique LocationLevel to an array', () => {
        const locationLevelArray: ILocationLevel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const locationLevelCollection: ILocationLevel[] = [sampleWithRequiredData];
        expectedResult = service.addLocationLevelToCollectionIfMissing(locationLevelCollection, ...locationLevelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const locationLevel: ILocationLevel = sampleWithRequiredData;
        const locationLevel2: ILocationLevel = sampleWithPartialData;
        expectedResult = service.addLocationLevelToCollectionIfMissing([], locationLevel, locationLevel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(locationLevel);
        expect(expectedResult).toContain(locationLevel2);
      });

      it('should accept null and undefined values', () => {
        const locationLevel: ILocationLevel = sampleWithRequiredData;
        expectedResult = service.addLocationLevelToCollectionIfMissing([], null, locationLevel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(locationLevel);
      });

      it('should return initial array if no LocationLevel is added', () => {
        const locationLevelCollection: ILocationLevel[] = [sampleWithRequiredData];
        expectedResult = service.addLocationLevelToCollectionIfMissing(locationLevelCollection, undefined, null);
        expect(expectedResult).toEqual(locationLevelCollection);
      });
    });

    describe('compareLocationLevel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLocationLevel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLocationLevel(entity1, entity2);
        const compareResult2 = service.compareLocationLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLocationLevel(entity1, entity2);
        const compareResult2 = service.compareLocationLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLocationLevel(entity1, entity2);
        const compareResult2 = service.compareLocationLevel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
