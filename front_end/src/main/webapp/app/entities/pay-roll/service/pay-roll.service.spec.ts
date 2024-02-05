import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPayRoll } from '../pay-roll.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pay-roll.test-samples';

import { PayRollService, RestPayRoll } from './pay-roll.service';

const requireRestSample: RestPayRoll = {
  ...sampleWithRequiredData,
  payFrom: sampleWithRequiredData.payFrom?.format(DATE_FORMAT),
  payTo: sampleWithRequiredData.payTo?.format(DATE_FORMAT),
};

describe('PayRoll Service', () => {
  let service: PayRollService;
  let httpMock: HttpTestingController;
  let expectedResult: IPayRoll | IPayRoll[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PayRollService);
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

    it('should create a PayRoll', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payRoll = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(payRoll).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PayRoll', () => {
      const payRoll = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(payRoll).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PayRoll', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PayRoll', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PayRoll', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPayRollToCollectionIfMissing', () => {
      it('should add a PayRoll to an empty array', () => {
        const payRoll: IPayRoll = sampleWithRequiredData;
        expectedResult = service.addPayRollToCollectionIfMissing([], payRoll);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payRoll);
      });

      it('should not add a PayRoll to an array that contains it', () => {
        const payRoll: IPayRoll = sampleWithRequiredData;
        const payRollCollection: IPayRoll[] = [
          {
            ...payRoll,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPayRollToCollectionIfMissing(payRollCollection, payRoll);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PayRoll to an array that doesn't contain it", () => {
        const payRoll: IPayRoll = sampleWithRequiredData;
        const payRollCollection: IPayRoll[] = [sampleWithPartialData];
        expectedResult = service.addPayRollToCollectionIfMissing(payRollCollection, payRoll);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payRoll);
      });

      it('should add only unique PayRoll to an array', () => {
        const payRollArray: IPayRoll[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const payRollCollection: IPayRoll[] = [sampleWithRequiredData];
        expectedResult = service.addPayRollToCollectionIfMissing(payRollCollection, ...payRollArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const payRoll: IPayRoll = sampleWithRequiredData;
        const payRoll2: IPayRoll = sampleWithPartialData;
        expectedResult = service.addPayRollToCollectionIfMissing([], payRoll, payRoll2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payRoll);
        expect(expectedResult).toContain(payRoll2);
      });

      it('should accept null and undefined values', () => {
        const payRoll: IPayRoll = sampleWithRequiredData;
        expectedResult = service.addPayRollToCollectionIfMissing([], null, payRoll, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payRoll);
      });

      it('should return initial array if no PayRoll is added', () => {
        const payRollCollection: IPayRoll[] = [sampleWithRequiredData];
        expectedResult = service.addPayRollToCollectionIfMissing(payRollCollection, undefined, null);
        expect(expectedResult).toEqual(payRollCollection);
      });
    });

    describe('comparePayRoll', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePayRoll(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePayRoll(entity1, entity2);
        const compareResult2 = service.comparePayRoll(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePayRoll(entity1, entity2);
        const compareResult2 = service.comparePayRoll(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePayRoll(entity1, entity2);
        const compareResult2 = service.comparePayRoll(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
