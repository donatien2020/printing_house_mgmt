import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReceipt } from '../receipt.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../receipt.test-samples';

import { ReceiptService, RestReceipt } from './receipt.service';

const requireRestSample: RestReceipt = {
  ...sampleWithRequiredData,
  paymentDate: sampleWithRequiredData.paymentDate?.toJSON(),
};

describe('Receipt Service', () => {
  let service: ReceiptService;
  let httpMock: HttpTestingController;
  let expectedResult: IReceipt | IReceipt[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReceiptService);
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

    it('should create a Receipt', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const receipt = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(receipt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Receipt', () => {
      const receipt = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(receipt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Receipt', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Receipt', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Receipt', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReceiptToCollectionIfMissing', () => {
      it('should add a Receipt to an empty array', () => {
        const receipt: IReceipt = sampleWithRequiredData;
        expectedResult = service.addReceiptToCollectionIfMissing([], receipt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(receipt);
      });

      it('should not add a Receipt to an array that contains it', () => {
        const receipt: IReceipt = sampleWithRequiredData;
        const receiptCollection: IReceipt[] = [
          {
            ...receipt,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReceiptToCollectionIfMissing(receiptCollection, receipt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Receipt to an array that doesn't contain it", () => {
        const receipt: IReceipt = sampleWithRequiredData;
        const receiptCollection: IReceipt[] = [sampleWithPartialData];
        expectedResult = service.addReceiptToCollectionIfMissing(receiptCollection, receipt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(receipt);
      });

      it('should add only unique Receipt to an array', () => {
        const receiptArray: IReceipt[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const receiptCollection: IReceipt[] = [sampleWithRequiredData];
        expectedResult = service.addReceiptToCollectionIfMissing(receiptCollection, ...receiptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const receipt: IReceipt = sampleWithRequiredData;
        const receipt2: IReceipt = sampleWithPartialData;
        expectedResult = service.addReceiptToCollectionIfMissing([], receipt, receipt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(receipt);
        expect(expectedResult).toContain(receipt2);
      });

      it('should accept null and undefined values', () => {
        const receipt: IReceipt = sampleWithRequiredData;
        expectedResult = service.addReceiptToCollectionIfMissing([], null, receipt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(receipt);
      });

      it('should return initial array if no Receipt is added', () => {
        const receiptCollection: IReceipt[] = [sampleWithRequiredData];
        expectedResult = service.addReceiptToCollectionIfMissing(receiptCollection, undefined, null);
        expect(expectedResult).toEqual(receiptCollection);
      });
    });

    describe('compareReceipt', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReceipt(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReceipt(entity1, entity2);
        const compareResult2 = service.compareReceipt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReceipt(entity1, entity2);
        const compareResult2 = service.compareReceipt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReceipt(entity1, entity2);
        const compareResult2 = service.compareReceipt(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
