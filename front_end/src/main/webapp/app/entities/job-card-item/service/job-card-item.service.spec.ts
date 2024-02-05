import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobCardItem } from '../job-card-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../job-card-item.test-samples';

import { JobCardItemService } from './job-card-item.service';

const requireRestSample: IJobCardItem = {
  ...sampleWithRequiredData,
};

describe('JobCardItem Service', () => {
  let service: JobCardItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobCardItem | IJobCardItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JobCardItemService);
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

    it('should create a JobCardItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jobCardItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobCardItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobCardItem', () => {
      const jobCardItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobCardItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobCardItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobCardItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobCardItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobCardItemToCollectionIfMissing', () => {
      it('should add a JobCardItem to an empty array', () => {
        const jobCardItem: IJobCardItem = sampleWithRequiredData;
        expectedResult = service.addJobCardItemToCollectionIfMissing([], jobCardItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCardItem);
      });

      it('should not add a JobCardItem to an array that contains it', () => {
        const jobCardItem: IJobCardItem = sampleWithRequiredData;
        const jobCardItemCollection: IJobCardItem[] = [
          {
            ...jobCardItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobCardItemToCollectionIfMissing(jobCardItemCollection, jobCardItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobCardItem to an array that doesn't contain it", () => {
        const jobCardItem: IJobCardItem = sampleWithRequiredData;
        const jobCardItemCollection: IJobCardItem[] = [sampleWithPartialData];
        expectedResult = service.addJobCardItemToCollectionIfMissing(jobCardItemCollection, jobCardItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCardItem);
      });

      it('should add only unique JobCardItem to an array', () => {
        const jobCardItemArray: IJobCardItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobCardItemCollection: IJobCardItem[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardItemToCollectionIfMissing(jobCardItemCollection, ...jobCardItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobCardItem: IJobCardItem = sampleWithRequiredData;
        const jobCardItem2: IJobCardItem = sampleWithPartialData;
        expectedResult = service.addJobCardItemToCollectionIfMissing([], jobCardItem, jobCardItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCardItem);
        expect(expectedResult).toContain(jobCardItem2);
      });

      it('should accept null and undefined values', () => {
        const jobCardItem: IJobCardItem = sampleWithRequiredData;
        expectedResult = service.addJobCardItemToCollectionIfMissing([], null, jobCardItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCardItem);
      });

      it('should return initial array if no JobCardItem is added', () => {
        const jobCardItemCollection: IJobCardItem[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardItemToCollectionIfMissing(jobCardItemCollection, undefined, null);
        expect(expectedResult).toEqual(jobCardItemCollection);
      });
    });

    describe('compareJobCardItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobCardItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJobCardItem(entity1, entity2);
        const compareResult2 = service.compareJobCardItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJobCardItem(entity1, entity2);
        const compareResult2 = service.compareJobCardItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJobCardItem(entity1, entity2);
        const compareResult2 = service.compareJobCardItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
