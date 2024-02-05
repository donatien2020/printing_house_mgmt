import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReceiptFormService } from './receipt-form.service';
import { ReceiptService } from '../service/receipt.service';
import { IReceipt } from '../receipt.model';

import { ReceiptUpdateComponent } from './receipt-update.component';

describe('Receipt Management Update Component', () => {
  let comp: ReceiptUpdateComponent;
  let fixture: ComponentFixture<ReceiptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let receiptFormService: ReceiptFormService;
  let receiptService: ReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReceiptUpdateComponent],
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
      .overrideTemplate(ReceiptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReceiptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    receiptFormService = TestBed.inject(ReceiptFormService);
    receiptService = TestBed.inject(ReceiptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const receipt: IReceipt = { id: 456 };

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(comp.receipt).toEqual(receipt);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptFormService, 'getReceipt').mockReturnValue(receipt);
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(receiptFormService.getReceipt).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(receiptService.update).toHaveBeenCalledWith(expect.objectContaining(receipt));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptFormService, 'getReceipt').mockReturnValue({ id: null });
      jest.spyOn(receiptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(receiptFormService.getReceipt).toHaveBeenCalled();
      expect(receiptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(receiptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
