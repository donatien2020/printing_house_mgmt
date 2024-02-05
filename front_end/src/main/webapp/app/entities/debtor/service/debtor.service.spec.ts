import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDebtor } from '../debtor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../debtor.test-samples';

import { DebtorService, RestDebtor } from './debtor.service';

const requireRestSample: RestDebtor = {
  ...sampleWithRequiredData,
  debtDate: sampleWithRequiredData.debtDate?.toJSON(),
};

describe('Debtor Service', () => {
  let service: DebtorService;
  let httpMock: HttpTestingController;
  let expectedResult: IDebtor | IDebtor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DebtorService);
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

    it('should create a Debtor', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const debtor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(debtor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Debtor', () => {
      const debtor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(debtor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Debtor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Debtor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Debtor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDebtorToCollectionIfMissing', () => {
      it('should add a Debtor to an empty array', () => {
        const debtor: IDebtor = sampleWithRequiredData;
        expectedResult = service.addDebtorToCollectionIfMissing([], debtor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(debtor);
      });

      it('should not add a Debtor to an array that contains it', () => {
        const debtor: IDebtor = sampleWithRequiredData;
        const debtorCollection: IDebtor[] = [
          {
            ...debtor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDebtorToCollectionIfMissing(debtorCollection, debtor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Debtor to an array that doesn't contain it", () => {
        const debtor: IDebtor = sampleWithRequiredData;
        const debtorCollection: IDebtor[] = [sampleWithPartialData];
        expectedResult = service.addDebtorToCollectionIfMissing(debtorCollection, debtor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(debtor);
      });

      it('should add only unique Debtor to an array', () => {
        const debtorArray: IDebtor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const debtorCollection: IDebtor[] = [sampleWithRequiredData];
        expectedResult = service.addDebtorToCollectionIfMissing(debtorCollection, ...debtorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const debtor: IDebtor = sampleWithRequiredData;
        const debtor2: IDebtor = sampleWithPartialData;
        expectedResult = service.addDebtorToCollectionIfMissing([], debtor, debtor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(debtor);
        expect(expectedResult).toContain(debtor2);
      });

      it('should accept null and undefined values', () => {
        const debtor: IDebtor = sampleWithRequiredData;
        expectedResult = service.addDebtorToCollectionIfMissing([], null, debtor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(debtor);
      });

      it('should return initial array if no Debtor is added', () => {
        const debtorCollection: IDebtor[] = [sampleWithRequiredData];
        expectedResult = service.addDebtorToCollectionIfMissing(debtorCollection, undefined, null);
        expect(expectedResult).toEqual(debtorCollection);
      });
    });

    describe('compareDebtor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDebtor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDebtor(entity1, entity2);
        const compareResult2 = service.compareDebtor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDebtor(entity1, entity2);
        const compareResult2 = service.compareDebtor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDebtor(entity1, entity2);
        const compareResult2 = service.compareDebtor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
