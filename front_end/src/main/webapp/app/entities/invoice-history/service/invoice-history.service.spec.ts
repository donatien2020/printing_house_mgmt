import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInvoiceHistory } from '../invoice-history.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../invoice-history.test-samples';

import { InvoiceHistoryService, RestInvoiceHistory } from './invoice-history.service';

const requireRestSample: RestInvoiceHistory = {
  ...sampleWithRequiredData,
  doneOn: sampleWithRequiredData.doneOn?.toJSON(),
};

describe('InvoiceHistory Service', () => {
  let service: InvoiceHistoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IInvoiceHistory | IInvoiceHistory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InvoiceHistoryService);
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

    it('should create a InvoiceHistory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const invoiceHistory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(invoiceHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InvoiceHistory', () => {
      const invoiceHistory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(invoiceHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InvoiceHistory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InvoiceHistory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InvoiceHistory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInvoiceHistoryToCollectionIfMissing', () => {
      it('should add a InvoiceHistory to an empty array', () => {
        const invoiceHistory: IInvoiceHistory = sampleWithRequiredData;
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing([], invoiceHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoiceHistory);
      });

      it('should not add a InvoiceHistory to an array that contains it', () => {
        const invoiceHistory: IInvoiceHistory = sampleWithRequiredData;
        const invoiceHistoryCollection: IInvoiceHistory[] = [
          {
            ...invoiceHistory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing(invoiceHistoryCollection, invoiceHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InvoiceHistory to an array that doesn't contain it", () => {
        const invoiceHistory: IInvoiceHistory = sampleWithRequiredData;
        const invoiceHistoryCollection: IInvoiceHistory[] = [sampleWithPartialData];
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing(invoiceHistoryCollection, invoiceHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoiceHistory);
      });

      it('should add only unique InvoiceHistory to an array', () => {
        const invoiceHistoryArray: IInvoiceHistory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const invoiceHistoryCollection: IInvoiceHistory[] = [sampleWithRequiredData];
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing(invoiceHistoryCollection, ...invoiceHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const invoiceHistory: IInvoiceHistory = sampleWithRequiredData;
        const invoiceHistory2: IInvoiceHistory = sampleWithPartialData;
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing([], invoiceHistory, invoiceHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoiceHistory);
        expect(expectedResult).toContain(invoiceHistory2);
      });

      it('should accept null and undefined values', () => {
        const invoiceHistory: IInvoiceHistory = sampleWithRequiredData;
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing([], null, invoiceHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoiceHistory);
      });

      it('should return initial array if no InvoiceHistory is added', () => {
        const invoiceHistoryCollection: IInvoiceHistory[] = [sampleWithRequiredData];
        expectedResult = service.addInvoiceHistoryToCollectionIfMissing(invoiceHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(invoiceHistoryCollection);
      });
    });

    describe('compareInvoiceHistory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInvoiceHistory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInvoiceHistory(entity1, entity2);
        const compareResult2 = service.compareInvoiceHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInvoiceHistory(entity1, entity2);
        const compareResult2 = service.compareInvoiceHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInvoiceHistory(entity1, entity2);
        const compareResult2 = service.compareInvoiceHistory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
