import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinancialClientEngagementFormService } from './financial-client-engagement-form.service';
import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';
import { IFinancialClientEngagement } from '../financial-client-engagement.model';

import { FinancialClientEngagementUpdateComponent } from './financial-client-engagement-update.component';

describe('FinancialClientEngagement Management Update Component', () => {
  let comp: FinancialClientEngagementUpdateComponent;
  let fixture: ComponentFixture<FinancialClientEngagementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let financialClientEngagementFormService: FinancialClientEngagementFormService;
  let financialClientEngagementService: FinancialClientEngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinancialClientEngagementUpdateComponent],
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
      .overrideTemplate(FinancialClientEngagementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinancialClientEngagementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    financialClientEngagementFormService = TestBed.inject(FinancialClientEngagementFormService);
    financialClientEngagementService = TestBed.inject(FinancialClientEngagementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const financialClientEngagement: IFinancialClientEngagement = { id: 456 };

      activatedRoute.data = of({ financialClientEngagement });
      comp.ngOnInit();

      expect(comp.financialClientEngagement).toEqual(financialClientEngagement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialClientEngagement>>();
      const financialClientEngagement = { id: 123 };
      jest.spyOn(financialClientEngagementFormService, 'getFinancialClientEngagement').mockReturnValue(financialClientEngagement);
      jest.spyOn(financialClientEngagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialClientEngagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialClientEngagement }));
      saveSubject.complete();

      // THEN
      expect(financialClientEngagementFormService.getFinancialClientEngagement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(financialClientEngagementService.update).toHaveBeenCalledWith(expect.objectContaining(financialClientEngagement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialClientEngagement>>();
      const financialClientEngagement = { id: 123 };
      jest.spyOn(financialClientEngagementFormService, 'getFinancialClientEngagement').mockReturnValue({ id: null });
      jest.spyOn(financialClientEngagementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialClientEngagement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: financialClientEngagement }));
      saveSubject.complete();

      // THEN
      expect(financialClientEngagementFormService.getFinancialClientEngagement).toHaveBeenCalled();
      expect(financialClientEngagementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinancialClientEngagement>>();
      const financialClientEngagement = { id: 123 };
      jest.spyOn(financialClientEngagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ financialClientEngagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(financialClientEngagementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
