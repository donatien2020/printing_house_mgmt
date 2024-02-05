import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDivision } from '../division.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../division.test-samples';

import { DivisionService } from './division.service';

const requireRestSample: IDivision = {
  ...sampleWithRequiredData,
};

describe('Division Service', () => {
  let service: DivisionService;
  let httpMock: HttpTestingController;
  let expectedResult: IDivision | IDivision[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DivisionService);
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

    it('should create a Division', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const division = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(division).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Division', () => {
      const division = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(division).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Division', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Division', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Division', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDivisionToCollectionIfMissing', () => {
      it('should add a Division to an empty array', () => {
        const division: IDivision = sampleWithRequiredData;
        expectedResult = service.addDivisionToCollectionIfMissing([], division);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(division);
      });

      it('should not add a Division to an array that contains it', () => {
        const division: IDivision = sampleWithRequiredData;
        const divisionCollection: IDivision[] = [
          {
            ...division,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDivisionToCollectionIfMissing(divisionCollection, division);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Division to an array that doesn't contain it", () => {
        const division: IDivision = sampleWithRequiredData;
        const divisionCollection: IDivision[] = [sampleWithPartialData];
        expectedResult = service.addDivisionToCollectionIfMissing(divisionCollection, division);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(division);
      });

      it('should add only unique Division to an array', () => {
        const divisionArray: IDivision[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const divisionCollection: IDivision[] = [sampleWithRequiredData];
        expectedResult = service.addDivisionToCollectionIfMissing(divisionCollection, ...divisionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const division: IDivision = sampleWithRequiredData;
        const division2: IDivision = sampleWithPartialData;
        expectedResult = service.addDivisionToCollectionIfMissing([], division, division2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(division);
        expect(expectedResult).toContain(division2);
      });

      it('should accept null and undefined values', () => {
        const division: IDivision = sampleWithRequiredData;
        expectedResult = service.addDivisionToCollectionIfMissing([], null, division, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(division);
      });

      it('should return initial array if no Division is added', () => {
        const divisionCollection: IDivision[] = [sampleWithRequiredData];
        expectedResult = service.addDivisionToCollectionIfMissing(divisionCollection, undefined, null);
        expect(expectedResult).toEqual(divisionCollection);
      });
    });

    describe('compareDivision', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDivision(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDivision(entity1, entity2);
        const compareResult2 = service.compareDivision(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDivision(entity1, entity2);
        const compareResult2 = service.compareDivision(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDivision(entity1, entity2);
        const compareResult2 = service.compareDivision(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
