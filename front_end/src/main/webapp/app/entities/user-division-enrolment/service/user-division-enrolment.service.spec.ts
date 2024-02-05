import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserDivisionEnrolment } from '../user-division-enrolment.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../user-division-enrolment.test-samples';

import { UserDivisionEnrolmentService, RestUserDivisionEnrolment } from './user-division-enrolment.service';

const requireRestSample: RestUserDivisionEnrolment = {
  ...sampleWithRequiredData,
  startedOn: sampleWithRequiredData.startedOn?.toJSON(),
  endedOn: sampleWithRequiredData.endedOn?.toJSON(),
};

describe('UserDivisionEnrolment Service', () => {
  let service: UserDivisionEnrolmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserDivisionEnrolment | IUserDivisionEnrolment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserDivisionEnrolmentService);
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

    it('should create a UserDivisionEnrolment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userDivisionEnrolment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userDivisionEnrolment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserDivisionEnrolment', () => {
      const userDivisionEnrolment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userDivisionEnrolment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserDivisionEnrolment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserDivisionEnrolment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserDivisionEnrolment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserDivisionEnrolmentToCollectionIfMissing', () => {
      it('should add a UserDivisionEnrolment to an empty array', () => {
        const userDivisionEnrolment: IUserDivisionEnrolment = sampleWithRequiredData;
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing([], userDivisionEnrolment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDivisionEnrolment);
      });

      it('should not add a UserDivisionEnrolment to an array that contains it', () => {
        const userDivisionEnrolment: IUserDivisionEnrolment = sampleWithRequiredData;
        const userDivisionEnrolmentCollection: IUserDivisionEnrolment[] = [
          {
            ...userDivisionEnrolment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing(userDivisionEnrolmentCollection, userDivisionEnrolment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserDivisionEnrolment to an array that doesn't contain it", () => {
        const userDivisionEnrolment: IUserDivisionEnrolment = sampleWithRequiredData;
        const userDivisionEnrolmentCollection: IUserDivisionEnrolment[] = [sampleWithPartialData];
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing(userDivisionEnrolmentCollection, userDivisionEnrolment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDivisionEnrolment);
      });

      it('should add only unique UserDivisionEnrolment to an array', () => {
        const userDivisionEnrolmentArray: IUserDivisionEnrolment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userDivisionEnrolmentCollection: IUserDivisionEnrolment[] = [sampleWithRequiredData];
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing(
          userDivisionEnrolmentCollection,
          ...userDivisionEnrolmentArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userDivisionEnrolment: IUserDivisionEnrolment = sampleWithRequiredData;
        const userDivisionEnrolment2: IUserDivisionEnrolment = sampleWithPartialData;
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing([], userDivisionEnrolment, userDivisionEnrolment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDivisionEnrolment);
        expect(expectedResult).toContain(userDivisionEnrolment2);
      });

      it('should accept null and undefined values', () => {
        const userDivisionEnrolment: IUserDivisionEnrolment = sampleWithRequiredData;
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing([], null, userDivisionEnrolment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDivisionEnrolment);
      });

      it('should return initial array if no UserDivisionEnrolment is added', () => {
        const userDivisionEnrolmentCollection: IUserDivisionEnrolment[] = [sampleWithRequiredData];
        expectedResult = service.addUserDivisionEnrolmentToCollectionIfMissing(userDivisionEnrolmentCollection, undefined, null);
        expect(expectedResult).toEqual(userDivisionEnrolmentCollection);
      });
    });

    describe('compareUserDivisionEnrolment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserDivisionEnrolment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserDivisionEnrolment(entity1, entity2);
        const compareResult2 = service.compareUserDivisionEnrolment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserDivisionEnrolment(entity1, entity2);
        const compareResult2 = service.compareUserDivisionEnrolment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserDivisionEnrolment(entity1, entity2);
        const compareResult2 = service.compareUserDivisionEnrolment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
