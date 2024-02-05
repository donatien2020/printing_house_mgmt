import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PayRollItemFormService } from './pay-roll-item-form.service';
import { PayRollItemService } from '../service/pay-roll-item.service';
import { IPayRollItem } from '../pay-roll-item.model';
import { IPayRoll } from 'app/entities/pay-roll/pay-roll.model';
import { PayRollService } from 'app/entities/pay-roll/service/pay-roll.service';

import { PayRollItemUpdateComponent } from './pay-roll-item-update.component';

describe('PayRollItem Management Update Component', () => {
  let comp: PayRollItemUpdateComponent;
  let fixture: ComponentFixture<PayRollItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let payRollItemFormService: PayRollItemFormService;
  let payRollItemService: PayRollItemService;
  let payRollService: PayRollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PayRollItemUpdateComponent],
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
      .overrideTemplate(PayRollItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayRollItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    payRollItemFormService = TestBed.inject(PayRollItemFormService);
    payRollItemService = TestBed.inject(PayRollItemService);
    payRollService = TestBed.inject(PayRollService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PayRoll query and add missing value', () => {
      const payRollItem: IPayRollItem = { id: 456 };
      const payRoll: IPayRoll = { id: 43407 };
      payRollItem.payRoll = payRoll;

      const payRollCollection: IPayRoll[] = [{ id: 5836 }];
      jest.spyOn(payRollService, 'query').mockReturnValue(of(new HttpResponse({ body: payRollCollection })));
      const additionalPayRolls = [payRoll];
      const expectedCollection: IPayRoll[] = [...additionalPayRolls, ...payRollCollection];
      jest.spyOn(payRollService, 'addPayRollToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payRollItem });
      comp.ngOnInit();

      expect(payRollService.query).toHaveBeenCalled();
      expect(payRollService.addPayRollToCollectionIfMissing).toHaveBeenCalledWith(
        payRollCollection,
        ...additionalPayRolls.map(expect.objectContaining)
      );
      expect(comp.payRollsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const payRollItem: IPayRollItem = { id: 456 };
      const payRoll: IPayRoll = { id: 91683 };
      payRollItem.payRoll = payRoll;

      activatedRoute.data = of({ payRollItem });
      comp.ngOnInit();

      expect(comp.payRollsSharedCollection).toContain(payRoll);
      expect(comp.payRollItem).toEqual(payRollItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRollItem>>();
      const payRollItem = { id: 123 };
      jest.spyOn(payRollItemFormService, 'getPayRollItem').mockReturnValue(payRollItem);
      jest.spyOn(payRollItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRollItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payRollItem }));
      saveSubject.complete();

      // THEN
      expect(payRollItemFormService.getPayRollItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(payRollItemService.update).toHaveBeenCalledWith(expect.objectContaining(payRollItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRollItem>>();
      const payRollItem = { id: 123 };
      jest.spyOn(payRollItemFormService, 'getPayRollItem').mockReturnValue({ id: null });
      jest.spyOn(payRollItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRollItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payRollItem }));
      saveSubject.complete();

      // THEN
      expect(payRollItemFormService.getPayRollItem).toHaveBeenCalled();
      expect(payRollItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayRollItem>>();
      const payRollItem = { id: 123 };
      jest.spyOn(payRollItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payRollItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(payRollItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePayRoll', () => {
      it('Should forward to payRollService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(payRollService, 'comparePayRoll');
        comp.comparePayRoll(entity, entity2);
        expect(payRollService.comparePayRoll).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
