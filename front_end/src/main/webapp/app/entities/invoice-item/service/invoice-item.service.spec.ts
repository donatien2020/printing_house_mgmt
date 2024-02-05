import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInvoiceItem } from '../invoice-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../invoice-item.test-samples';

import { InvoiceItemService } from './invoice-item.service';

const requireRestSample: IInvoiceItem = {
  ...sampleWithRequiredData,
};

describe('InvoiceItem Service', () => {
  let service: InvoiceItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IInvoiceItem | IInvoiceItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InvoiceItemService);
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

    it('should create a InvoiceItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const invoiceItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(invoiceItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InvoiceItem', () => {
      const invoiceItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(invoiceItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InvoiceItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InvoiceItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InvoiceItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInvoiceItemToCollectionIfMissing', () => {
      it('should add a InvoiceItem to an empty array', () => {
        const invoiceItem: IInvoiceItem = sampleWithRequiredData;
        expectedResult = service.addInvoiceItemToCollectionIfMissing([], invoiceItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoiceItem);
      });

      it('should not add a InvoiceItem to an array that contains it', () => {
        const invoiceItem: IInvoiceItem = sampleWithRequiredData;
        const invoiceItemCollection: IInvoiceItem[] = [
          {
            ...invoiceItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInvoiceItemToCollectionIfMissing(invoiceItemCollection, invoiceItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InvoiceItem to an array that doesn't contain it", () => {
        const invoiceItem: IInvoiceItem = sampleWithRequiredData;
        const invoiceItemCollection: IInvoiceItem[] = [sampleWithPartialData];
        expectedResult = service.addInvoiceItemToCollectionIfMissing(invoiceItemCollection, invoiceItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoiceItem);
      });

      it('should add only unique InvoiceItem to an array', () => {
        const invoiceItemArray: IInvoiceItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const invoiceItemCollection: IInvoiceItem[] = [sampleWithRequiredData];
        expectedResult = service.addInvoiceItemToCollectionIfMissing(invoiceItemCollection, ...invoiceItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const invoiceItem: IInvoiceItem = sampleWithRequiredData;
        const invoiceItem2: IInvoiceItem = sampleWithPartialData;
        expectedResult = service.addInvoiceItemToCollectionIfMissing([], invoiceItem, invoiceItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoiceItem);
        expect(expectedResult).toContain(invoiceItem2);
      });

      it('should accept null and undefined values', () => {
        const invoiceItem: IInvoiceItem = sampleWithRequiredData;
        expectedResult = service.addInvoiceItemToCollectionIfMissing([], null, invoiceItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoiceItem);
      });

      it('should return initial array if no InvoiceItem is added', () => {
        const invoiceItemCollection: IInvoiceItem[] = [sampleWithRequiredData];
        expectedResult = service.addInvoiceItemToCollectionIfMissing(invoiceItemCollection, undefined, null);
        expect(expectedResult).toEqual(invoiceItemCollection);
      });
    });

    describe('compareInvoiceItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInvoiceItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInvoiceItem(entity1, entity2);
        const compareResult2 = service.compareInvoiceItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInvoiceItem(entity1, entity2);
        const compareResult2 = service.compareInvoiceItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInvoiceItem(entity1, entity2);
        const compareResult2 = service.compareInvoiceItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
