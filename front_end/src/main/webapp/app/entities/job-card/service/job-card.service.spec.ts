import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobCard } from '../job-card.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../job-card.test-samples';

import { JobCardService, RestJobCard } from './job-card.service';

const requireRestSample: RestJobCard = {
  ...sampleWithRequiredData,
  startedOn: sampleWithRequiredData.startedOn?.toJSON(),
  completedOn: sampleWithRequiredData.completedOn?.toJSON(),
};

describe('JobCard Service', () => {
  let service: JobCardService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobCard | IJobCard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JobCardService);
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

    it('should create a JobCard', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jobCard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobCard', () => {
      const jobCard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobCard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobCard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobCard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobCardToCollectionIfMissing', () => {
      it('should add a JobCard to an empty array', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        expectedResult = service.addJobCardToCollectionIfMissing([], jobCard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCard);
      });

      it('should not add a JobCard to an array that contains it', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCardCollection: IJobCard[] = [
          {
            ...jobCard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, jobCard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobCard to an array that doesn't contain it", () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCardCollection: IJobCard[] = [sampleWithPartialData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, jobCard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCard);
      });

      it('should add only unique JobCard to an array', () => {
        const jobCardArray: IJobCard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobCardCollection: IJobCard[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, ...jobCardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCard2: IJobCard = sampleWithPartialData;
        expectedResult = service.addJobCardToCollectionIfMissing([], jobCard, jobCard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCard);
        expect(expectedResult).toContain(jobCard2);
      });

      it('should accept null and undefined values', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        expectedResult = service.addJobCardToCollectionIfMissing([], null, jobCard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCard);
      });

      it('should return initial array if no JobCard is added', () => {
        const jobCardCollection: IJobCard[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, undefined, null);
        expect(expectedResult).toEqual(jobCardCollection);
      });
    });

    describe('compareJobCard', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobCard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
