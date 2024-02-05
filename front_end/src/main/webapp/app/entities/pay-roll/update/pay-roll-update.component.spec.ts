import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PayRollFormService } from './pay-roll-form.service';
import { PayRollService } from '../service/pay-roll.service';
import { IPayRoll } from '../pay-roll.model';

import { PayRollUpdateComponent } from './pay-roll-update.component';

describe('PayRoll Management Update Component', () => {
  let comp: PayRollUpdateComponent;
  let fixture: ComponentFixture<PayRollUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let payRollFormService: PayRollFormService;
  let payRollService: PayRollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PayRollUpdateComponent],
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
      .overrideTemplate(PayRollUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayRollUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    payRollFormService = TestBed.inject(PayRollFormService);
    payRollService = TestBed.inject(PayRollService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const payRoll: IPayRoll = { id: 456 };

      activatedRoute.data = of({ payRoll });
      comp.ngOnInit();

      expect(comp.payRoll).toEqual(payRoll);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRoll>>();
      const payRoll = { id: 123 };
      jest.spyOn(payRollFormService, 'getPayRoll').mockReturnValue(payRoll);
      jest.spyOn(payRollService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRoll });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payRoll }));
      saveSubject.complete();

      // THEN
      expect(payRollFormService.getPayRoll).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(payRollService.update).toHaveBeenCalledWith(expect.objectContaining(payRoll));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRoll>>();
      const payRoll = { id: 123 };
      jest.spyOn(payRollFormService, 'getPayRoll').mockReturnValue({ id: null });
      jest.spyOn(payRollService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRoll: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payRoll }));
      saveSubject.complete();

      // THEN
      expect(payRollFormService.getPayRoll).toHaveBeenCalled();
      expect(payRollService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRoll>>();
      const payRoll = { id: 123 };
      jest.spyOn(payRollService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRoll });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(payRollService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
