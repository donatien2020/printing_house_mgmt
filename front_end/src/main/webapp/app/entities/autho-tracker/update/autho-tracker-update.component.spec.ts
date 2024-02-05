import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuthoTrackerFormService } from './autho-tracker-form.service';
import { AuthoTrackerService } from '../service/autho-tracker.service';
import { IAuthoTracker } from '../autho-tracker.model';

import { AuthoTrackerUpdateComponent } from './autho-tracker-update.component';

describe('AuthoTracker Management Update Component', () => {
  let comp: AuthoTrackerUpdateComponent;
  let fixture: ComponentFixture<AuthoTrackerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let authoTrackerFormService: AuthoTrackerFormService;
  let authoTrackerService: AuthoTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AuthoTrackerUpdateComponent],
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
      .overrideTemplate(AuthoTrackerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthoTrackerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authoTrackerFormService = TestBed.inject(AuthoTrackerFormService);
    authoTrackerService = TestBed.inject(AuthoTrackerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const authoTracker: IAuthoTracker = { id: 456 };

      activatedRoute.data = of({ authoTracker });
      comp.ngOnInit();

      expect(comp.authoTracker).toEqual(authoTracker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthoTracker>>();
      const authoTracker = { id: 123 };
      jest.spyOn(authoTrackerFormService, 'getAuthoTracker').mockReturnValue(authoTracker);
      jest.spyOn(authoTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authoTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authoTracker }));
      saveSubject.complete();

      // THEN
      expect(authoTrackerFormService.getAuthoTracker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(authoTrackerService.update).toHaveBeenCalledWith(expect.objectContaining(authoTracker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthoTracker>>();
      const authoTracker = { id: 123 };
      jest.spyOn(authoTrackerFormService, 'getAuthoTracker').mockReturnValue({ id: null });
      jest.spyOn(authoTrackerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authoTracker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authoTracker }));
      saveSubject.complete();

      // THEN
      expect(authoTrackerFormService.getAuthoTracker).toHaveBeenCalled();
      expect(authoTrackerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthoTracker>>();
      const authoTracker = { id: 123 };
      jest.spyOn(authoTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authoTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(authoTrackerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
