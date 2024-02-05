import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DebtorFormService } from './debtor-form.service';
import { DebtorService } from '../service/debtor.service';
import { IDebtor } from '../debtor.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

import { DebtorUpdateComponent } from './debtor-update.component';

describe('Debtor Management Update Component', () => {
  let comp: DebtorUpdateComponent;
  let fixture: ComponentFixture<DebtorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let debtorFormService: DebtorFormService;
  let debtorService: DebtorService;
  let supplierService: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DebtorUpdateComponent],
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
      .overrideTemplate(DebtorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DebtorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    debtorFormService = TestBed.inject(DebtorFormService);
    debtorService = TestBed.inject(DebtorService);
    supplierService = TestBed.inject(SupplierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Supplier query and add missing value', () => {
      const debtor: IDebtor = { id: 456 };
      const supplier: ISupplier = { id: 5414 };
      debtor.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 93428 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ debtor });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const debtor: IDebtor = { id: 456 };
      const supplier: ISupplier = { id: 37002 };
      debtor.supplier = supplier;

      activatedRoute.data = of({ debtor });
      comp.ngOnInit();

      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.debtor).toEqual(debtor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDebtor>>();
      const debtor = { id: 123 };
      jest.spyOn(debtorFormService, 'getDebtor').mockReturnValue(debtor);
      jest.spyOn(debtorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ debtor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: debtor }));
      saveSubject.complete();

      // THEN
      expect(debtorFormService.getDebtor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(debtorService.update).toHaveBeenCalledWith(expect.objectContaining(debtor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDebtor>>();
      const debtor = { id: 123 };
      jest.spyOn(debtorFormService, 'getDebtor').mockReturnValue({ id: null });
      jest.spyOn(debtorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ debtor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: debtor }));
      saveSubject.complete();

      // THEN
      expect(debtorFormService.getDebtor).toHaveBeenCalled();
      expect(debtorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDebtor>>();
      const debtor = { id: 123 };
      jest.spyOn(debtorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ debtor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(debtorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSupplier', () => {
      it('Should forward to supplierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(supplierService, 'compareSupplier');
        comp.compareSupplier(entity, entity2);
        expect(supplierService.compareSupplier).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
