import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobCardAssignment } from '../job-card-assignment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../job-card-assignment.test-samples';

import { JobCardAssignmentService } from './job-card-assignment.service';

const requireRestSample: IJobCardAssignment = {
  ...sampleWithRequiredData,
};

describe('JobCardAssignment Service', () => {
  let service: JobCardAssignmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobCardAssignment | IJobCardAssignment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JobCardAssignmentService);
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

    it('should create a JobCardAssignment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jobCardAssignment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobCardAssignment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobCardAssignment', () => {
      const jobCardAssignment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobCardAssignment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobCardAssignment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobCardAssignment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobCardAssignment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobCardAssignmentToCollectionIfMissing', () => {
      it('should add a JobCardAssignment to an empty array', () => {
        const jobCardAssignment: IJobCardAssignment = sampleWithRequiredData;
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing([], jobCardAssignment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCardAssignment);
      });

      it('should not add a JobCardAssignment to an array that contains it', () => {
        const jobCardAssignment: IJobCardAssignment = sampleWithRequiredData;
        const jobCardAssignmentCollection: IJobCardAssignment[] = [
          {
            ...jobCardAssignment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing(jobCardAssignmentCollection, jobCardAssignment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobCardAssignment to an array that doesn't contain it", () => {
        const jobCardAssignment: IJobCardAssignment = sampleWithRequiredData;
        const jobCardAssignmentCollection: IJobCardAssignment[] = [sampleWithPartialData];
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing(jobCardAssignmentCollection, jobCardAssignment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCardAssignment);
      });

      it('should add only unique JobCardAssignment to an array', () => {
        const jobCardAssignmentArray: IJobCardAssignment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobCardAssignmentCollection: IJobCardAssignment[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing(jobCardAssignmentCollection, ...jobCardAssignmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobCardAssignment: IJobCardAssignment = sampleWithRequiredData;
        const jobCardAssignment2: IJobCardAssignment = sampleWithPartialData;
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing([], jobCardAssignment, jobCardAssignment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCardAssignment);
        expect(expectedResult).toContain(jobCardAssignment2);
      });

      it('should accept null and undefined values', () => {
        const jobCardAssignment: IJobCardAssignment = sampleWithRequiredData;
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing([], null, jobCardAssignment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCardAssignment);
      });

      it('should return initial array if no JobCardAssignment is added', () => {
        const jobCardAssignmentCollection: IJobCardAssignment[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardAssignmentToCollectionIfMissing(jobCardAssignmentCollection, undefined, null);
        expect(expectedResult).toEqual(jobCardAssignmentCollection);
      });
    });

    describe('compareJobCardAssignment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobCardAssignment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJobCardAssignment(entity1, entity2);
        const compareResult2 = service.compareJobCardAssignment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJobCardAssignment(entity1, entity2);
        const compareResult2 = service.compareJobCardAssignment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJobCardAssignment(entity1, entity2);
        const compareResult2 = service.compareJobCardAssignment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
