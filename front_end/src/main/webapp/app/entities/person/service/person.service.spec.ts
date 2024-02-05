import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPerson } from '../person.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../person.test-samples';

import { PersonService, RestPerson } from './person.service';

const requireRestSample: RestPerson = {
  ...sampleWithRequiredData,
  birthDate: sampleWithRequiredData.birthDate?.format(DATE_FORMAT),
};

describe('Person Service', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  let expectedResult: IPerson | IPerson[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonService);
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

    it('should create a Person', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const person = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(person).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Person', () => {
      const person = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(person).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Person', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Person', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Person', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPersonToCollectionIfMissing', () => {
      it('should add a Person to an empty array', () => {
        const person: IPerson = sampleWithRequiredData;
        expectedResult = service.addPersonToCollectionIfMissing([], person);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(person);
      });

      it('should not add a Person to an array that contains it', () => {
        const person: IPerson = sampleWithRequiredData;
        const personCollection: IPerson[] = [
          {
            ...person,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, person);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Person to an array that doesn't contain it", () => {
        const person: IPerson = sampleWithRequiredData;
        const personCollection: IPerson[] = [sampleWithPartialData];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, person);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(person);
      });

      it('should add only unique Person to an array', () => {
        const personArray: IPerson[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const personCollection: IPerson[] = [sampleWithRequiredData];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, ...personArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const person: IPerson = sampleWithRequiredData;
        const person2: IPerson = sampleWithPartialData;
        expectedResult = service.addPersonToCollectionIfMissing([], person, person2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(person);
        expect(expectedResult).toContain(person2);
      });

      it('should accept null and undefined values', () => {
        const person: IPerson = sampleWithRequiredData;
        expectedResult = service.addPersonToCollectionIfMissing([], null, person, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(person);
      });

      it('should return initial array if no Person is added', () => {
        const personCollection: IPerson[] = [sampleWithRequiredData];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, undefined, null);
        expect(expectedResult).toEqual(personCollection);
      });
    });

    describe('comparePerson', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePerson(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePerson(entity1, entity2);
        const compareResult2 = service.comparePerson(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePerson(entity1, entity2);
        const compareResult2 = service.comparePerson(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePerson(entity1, entity2);
        const compareResult2 = service.comparePerson(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
