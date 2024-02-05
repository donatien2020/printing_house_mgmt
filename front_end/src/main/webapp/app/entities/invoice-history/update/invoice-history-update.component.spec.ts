import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InvoiceHistoryFormService } from './invoice-history-form.service';
import { InvoiceHistoryService } from '../service/invoice-history.service';
import { IInvoiceHistory } from '../invoice-history.model';

import { InvoiceHistoryUpdateComponent } from './invoice-history-update.component';

describe('InvoiceHistory Management Update Component', () => {
  let comp: InvoiceHistoryUpdateComponent;
  let fixture: ComponentFixture<InvoiceHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let invoiceHistoryFormService: InvoiceHistoryFormService;
  let invoiceHistoryService: InvoiceHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InvoiceHistoryUpdateComponent],
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
      .overrideTemplate(InvoiceHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoiceHistoryFormService = TestBed.inject(InvoiceHistoryFormService);
    invoiceHistoryService = TestBed.inject(InvoiceHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const invoiceHistory: IInvoiceHistory = { id: 456 };

      activatedRoute.data = of({ invoiceHistory });
      comp.ngOnInit();

      expect(comp.invoiceHistory).toEqual(invoiceHistory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceHistory>>();
      const invoiceHistory = { id: 123 };
      jest.spyOn(invoiceHistoryFormService, 'getInvoiceHistory').mockReturnValue(invoiceHistory);
      jest.spyOn(invoiceHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoiceHistory }));
      saveSubject.complete();

      // THEN
      expect(invoiceHistoryFormService.getInvoiceHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoiceHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(invoiceHistory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceHistory>>();
      const invoiceHistory = { id: 123 };
      jest.spyOn(invoiceHistoryFormService, 'getInvoiceHistory').mockReturnValue({ id: null });
      jest.spyOn(invoiceHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoiceHistory }));
      saveSubject.complete();

      // THEN
      expect(invoiceHistoryFormService.getInvoiceHistory).toHaveBeenCalled();
      expect(invoiceHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceHistory>>();
      const invoiceHistory = { id: 123 };
      jest.spyOn(invoiceHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoiceHistoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
