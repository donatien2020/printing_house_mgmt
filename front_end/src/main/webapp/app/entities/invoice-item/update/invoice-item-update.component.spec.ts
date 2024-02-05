import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InvoiceItemFormService } from './invoice-item-form.service';
import { InvoiceItemService } from '../service/invoice-item.service';
import { IInvoiceItem } from '../invoice-item.model';

import { InvoiceItemUpdateComponent } from './invoice-item-update.component';

describe('InvoiceItem Management Update Component', () => {
  let comp: InvoiceItemUpdateComponent;
  let fixture: ComponentFixture<InvoiceItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let invoiceItemFormService: InvoiceItemFormService;
  let invoiceItemService: InvoiceItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InvoiceItemUpdateComponent],
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
      .overrideTemplate(InvoiceItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoiceItemFormService = TestBed.inject(InvoiceItemFormService);
    invoiceItemService = TestBed.inject(InvoiceItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const invoiceItem: IInvoiceItem = { id: 456 };

      activatedRoute.data = of({ invoiceItem });
      comp.ngOnInit();

      expect(comp.invoiceItem).toEqual(invoiceItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceItem>>();
      const invoiceItem = { id: 123 };
      jest.spyOn(invoiceItemFormService, 'getInvoiceItem').mockReturnValue(invoiceItem);
      jest.spyOn(invoiceItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoiceItem }));
      saveSubject.complete();

      // THEN
      expect(invoiceItemFormService.getInvoiceItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoiceItemService.update).toHaveBeenCalledWith(expect.objectContaining(invoiceItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceItem>>();
      const invoiceItem = { id: 123 };
      jest.spyOn(invoiceItemFormService, 'getInvoiceItem').mockReturnValue({ id: null });
      jest.spyOn(invoiceItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoiceItem }));
      saveSubject.complete();

      // THEN
      expect(invoiceItemFormService.getInvoiceItem).toHaveBeenCalled();
      expect(invoiceItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoiceItem>>();
      const invoiceItem = { id: 123 };
      jest.spyOn(invoiceItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoiceItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoiceItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
