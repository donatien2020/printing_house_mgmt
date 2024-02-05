import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAttachment } from '../attachment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../attachment.test-samples';

import { AttachmentService } from './attachment.service';

const requireRestSample: IAttachment = {
  ...sampleWithRequiredData,
};

describe('Attachment Service', () => {
  let service: AttachmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttachment | IAttachment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AttachmentService);
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

    it('should create a Attachment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const attachment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Attachment', () => {
      const attachment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Attachment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Attachment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Attachment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttachmentToCollectionIfMissing', () => {
      it('should add a Attachment to an empty array', () => {
        const attachment: IAttachment = sampleWithRequiredData;
        expectedResult = service.addAttachmentToCollectionIfMissing([], attachment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attachment);
      });

      it('should not add a Attachment to an array that contains it', () => {
        const attachment: IAttachment = sampleWithRequiredData;
        const attachmentCollection: IAttachment[] = [
          {
            ...attachment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttachmentToCollectionIfMissing(attachmentCollection, attachment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Attachment to an array that doesn't contain it", () => {
        const attachment: IAttachment = sampleWithRequiredData;
        const attachmentCollection: IAttachment[] = [sampleWithPartialData];
        expectedResult = service.addAttachmentToCollectionIfMissing(attachmentCollection, attachment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attachment);
      });

      it('should add only unique Attachment to an array', () => {
        const attachmentArray: IAttachment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attachmentCollection: IAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addAttachmentToCollectionIfMissing(attachmentCollection, ...attachmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attachment: IAttachment = sampleWithRequiredData;
        const attachment2: IAttachment = sampleWithPartialData;
        expectedResult = service.addAttachmentToCollectionIfMissing([], attachment, attachment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attachment);
        expect(expectedResult).toContain(attachment2);
      });

      it('should accept null and undefined values', () => {
        const attachment: IAttachment = sampleWithRequiredData;
        expectedResult = service.addAttachmentToCollectionIfMissing([], null, attachment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attachment);
      });

      it('should return initial array if no Attachment is added', () => {
        const attachmentCollection: IAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addAttachmentToCollectionIfMissing(attachmentCollection, undefined, null);
        expect(expectedResult).toEqual(attachmentCollection);
      });
    });

    describe('compareAttachment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttachment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAttachment(entity1, entity2);
        const compareResult2 = service.compareAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAttachment(entity1, entity2);
        const compareResult2 = service.compareAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAttachment(entity1, entity2);
        const compareResult2 = service.compareAttachment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
