import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobCardAssignmentFormService } from './job-card-assignment-form.service';
import { JobCardAssignmentService } from '../service/job-card-assignment.service';
import { IJobCardAssignment } from '../job-card-assignment.model';
import { IJobCard } from 'app/entities/job-card/job-card.model';
import { JobCardService } from 'app/entities/job-card/service/job-card.service';

import { JobCardAssignmentUpdateComponent } from './job-card-assignment-update.component';

describe('JobCardAssignment Management Update Component', () => {
  let comp: JobCardAssignmentUpdateComponent;
  let fixture: ComponentFixture<JobCardAssignmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobCardAssignmentFormService: JobCardAssignmentFormService;
  let jobCardAssignmentService: JobCardAssignmentService;
  let jobCardService: JobCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobCardAssignmentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(JobCardAssignmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardAssignmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobCardAssignmentFormService = TestBed.inject(JobCardAssignmentFormService);
    jobCardAssignmentService = TestBed.inject(JobCardAssignmentService);
    jobCardService = TestBed.inject(JobCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call JobCard query and add missing value', () => {
      const jobCardAssignment: IJobCardAssignment = { id: 456 };
      const jobCard: IJobCard = { id: 16583 };
      jobCardAssignment.jobCard = jobCard;

      const jobCardCollection: IJobCard[] = [{ id: 47038 }];
      jest.spyOn(jobCardService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCardCollection })));
      const additionalJobCards = [jobCard];
      const expectedCollection: IJobCard[] = [...additionalJobCards, ...jobCardCollection];
      jest.spyOn(jobCardService, 'addJobCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobCardAssignment });
      comp.ngOnInit();

      expect(jobCardService.query).toHaveBeenCalled();
      expect(jobCardService.addJobCardToCollectionIfMissing).toHaveBeenCalledWith(
        jobCardCollection,
        ...additionalJobCards.map(expect.objectContaining)
      );
      expect(comp.jobCardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jobCardAssignment: IJobCardAssignment = { id: 456 };
      const jobCard: IJobCard = { id: 28314 };
      jobCardAssignment.jobCard = jobCard;

      activatedRoute.data = of({ jobCardAssignment });
      comp.ngOnInit();

      expect(comp.jobCardsSharedCollection).toContain(jobCard);
      expect(comp.jobCardAssignment).toEqual(jobCardAssignment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardAssignment>>();
      const jobCardAssignment = { id: 123 };
      jest.spyOn(jobCardAssignmentFormService, 'getJobCardAssignment').mockReturnValue(jobCardAssignment);
      jest.spyOn(jobCardAssignmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardAssignment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCardAssignment }));
      saveSubject.complete();

      // THEN
      expect(jobCardAssignmentFormService.getJobCardAssignment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobCardAssignmentService.update).toHaveBeenCalledWith(expect.objectContaining(jobCardAssignment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardAssignment>>();
      const jobCardAssignment = { id: 123 };
      jest.spyOn(jobCardAssignmentFormService, 'getJobCardAssignment').mockReturnValue({ id: null });
      jest.spyOn(jobCardAssignmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardAssignment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCardAssignment }));
      saveSubject.complete();

      // THEN
      expect(jobCardAssignmentFormService.getJobCardAssignment).toHaveBeenCalled();
      expect(jobCardAssignmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardAssignment>>();
      const jobCardAssignment = { id: 123 };
      jest.spyOn(jobCardAssignmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardAssignment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobCardAssignmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobCard', () => {
      it('Should forward to jobCardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(jobCardService, 'compareJobCard');
        comp.compareJobCard(entity, entity2);
        expect(jobCardService.compareJobCard).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
