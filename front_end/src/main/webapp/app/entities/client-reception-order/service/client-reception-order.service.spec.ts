import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClientReceptionOrder } from '../client-reception-order.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../client-reception-order.test-samples';

import { ClientReceptionOrderService, RestClientReceptionOrder } from './client-reception-order.service';

const requireRestSample: RestClientReceptionOrder = {
  ...sampleWithRequiredData,
  receivedOn: sampleWithRequiredData.receivedOn?.toJSON(),
  deliveryDate: sampleWithRequiredData.deliveryDate?.toJSON(),
};

describe('ClientReceptionOrder Service', () => {
  let service: ClientReceptionOrderService;
  let httpMock: HttpTestingController;
  let expectedResult: IClientReceptionOrder | IClientReceptionOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClientReceptionOrderService);
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

    it('should create a ClientReceptionOrder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const clientReceptionOrder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clientReceptionOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientReceptionOrder', () => {
      const clientReceptionOrder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clientReceptionOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientReceptionOrder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientReceptionOrder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClientReceptionOrder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClientReceptionOrderToCollectionIfMissing', () => {
      it('should add a ClientReceptionOrder to an empty array', () => {
        const clientReceptionOrder: IClientReceptionOrder = sampleWithRequiredData;
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing([], clientReceptionOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientReceptionOrder);
      });

      it('should not add a ClientReceptionOrder to an array that contains it', () => {
        const clientReceptionOrder: IClientReceptionOrder = sampleWithRequiredData;
        const clientReceptionOrderCollection: IClientReceptionOrder[] = [
          {
            ...clientReceptionOrder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing(clientReceptionOrderCollection, clientReceptionOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientReceptionOrder to an array that doesn't contain it", () => {
        const clientReceptionOrder: IClientReceptionOrder = sampleWithRequiredData;
        const clientReceptionOrderCollection: IClientReceptionOrder[] = [sampleWithPartialData];
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing(clientReceptionOrderCollection, clientReceptionOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientReceptionOrder);
      });

      it('should add only unique ClientReceptionOrder to an array', () => {
        const clientReceptionOrderArray: IClientReceptionOrder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientReceptionOrderCollection: IClientReceptionOrder[] = [sampleWithRequiredData];
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing(clientReceptionOrderCollection, ...clientReceptionOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientReceptionOrder: IClientReceptionOrder = sampleWithRequiredData;
        const clientReceptionOrder2: IClientReceptionOrder = sampleWithPartialData;
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing([], clientReceptionOrder, clientReceptionOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientReceptionOrder);
        expect(expectedResult).toContain(clientReceptionOrder2);
      });

      it('should accept null and undefined values', () => {
        const clientReceptionOrder: IClientReceptionOrder = sampleWithRequiredData;
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing([], null, clientReceptionOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientReceptionOrder);
      });

      it('should return initial array if no ClientReceptionOrder is added', () => {
        const clientReceptionOrderCollection: IClientReceptionOrder[] = [sampleWithRequiredData];
        expectedResult = service.addClientReceptionOrderToCollectionIfMissing(clientReceptionOrderCollection, undefined, null);
        expect(expectedResult).toEqual(clientReceptionOrderCollection);
      });
    });

    describe('compareClientReceptionOrder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientReceptionOrder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClientReceptionOrder(entity1, entity2);
        const compareResult2 = service.compareClientReceptionOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClientReceptionOrder(entity1, entity2);
        const compareResult2 = service.compareClientReceptionOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClientReceptionOrder(entity1, entity2);
        const compareResult2 = service.compareClientReceptionOrder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
