import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPayRollItem } from '../pay-roll-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pay-roll-item.test-samples';

import { PayRollItemService, RestPayRollItem } from './pay-roll-item.service';

const requireRestSample: RestPayRollItem = {
  ...sampleWithRequiredData,
  collectionDate: sampleWithRequiredData.collectionDate?.toJSON(),
  computationDate: sampleWithRequiredData.computationDate?.toJSON(),
};

describe('PayRollItem Service', () => {
  let service: PayRollItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IPayRollItem | IPayRollItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PayRollItemService);
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

    it('should create a PayRollItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payRollItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(payRollItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PayRollItem', () => {
      const payRollItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(payRollItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PayRollItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PayRollItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PayRollItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPayRollItemToCollectionIfMissing', () => {
      it('should add a PayRollItem to an empty array', () => {
        const payRollItem: IPayRollItem = sampleWithRequiredData;
        expectedResult = service.addPayRollItemToCollectionIfMissing([], payRollItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payRollItem);
      });

      it('should not add a PayRollItem to an array that contains it', () => {
        const payRollItem: IPayRollItem = sampleWithRequiredData;
        const payRollItemCollection: IPayRollItem[] = [
          {
            ...payRollItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPayRollItemToCollectionIfMissing(payRollItemCollection, payRollItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PayRollItem to an array that doesn't contain it", () => {
        const payRollItem: IPayRollItem = sampleWithRequiredData;
        const payRollItemCollection: IPayRollItem[] = [sampleWithPartialData];
        expectedResult = service.addPayRollItemToCollectionIfMissing(payRollItemCollection, payRollItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payRollItem);
      });

      it('should add only unique PayRollItem to an array', () => {
        const payRollItemArray: IPayRollItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const payRollItemCollection: IPayRollItem[] = [sampleWithRequiredData];
        expectedResult = service.addPayRollItemToCollectionIfMissing(payRollItemCollection, ...payRollItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const payRollItem: IPayRollItem = sampleWithRequiredData;
        const payRollItem2: IPayRollItem = sampleWithPartialData;
        expectedResult = service.addPayRollItemToCollectionIfMissing([], payRollItem, payRollItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payRollItem);
        expect(expectedResult).toContain(payRollItem2);
      });

      it('should accept null and undefined values', () => {
        const payRollItem: IPayRollItem = sampleWithRequiredData;
        expectedResult = service.addPayRollItemToCollectionIfMissing([], null, payRollItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payRollItem);
      });

      it('should return initial array if no PayRollItem is added', () => {
        const payRollItemCollection: IPayRollItem[] = [sampleWithRequiredData];
        expectedResult = service.addPayRollItemToCollectionIfMissing(payRollItemCollection, undefined, null);
        expect(expectedResult).toEqual(payRollItemCollection);
      });
    });

    describe('comparePayRollItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePayRollItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePayRollItem(entity1, entity2);
        const compareResult2 = service.comparePayRollItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePayRollItem(entity1, entity2);
        const compareResult2 = service.comparePayRollItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePayRollItem(entity1, entity2);
        const compareResult2 = service.comparePayRollItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
