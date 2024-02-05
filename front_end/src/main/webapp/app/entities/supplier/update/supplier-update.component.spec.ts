import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SupplierFormService } from './supplier-form.service';
import { SupplierService } from '../service/supplier.service';
import { ISupplier } from '../supplier.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { SupplierUpdateComponent } from './supplier-update.component';

describe('Supplier Management Update Component', () => {
  let comp: SupplierUpdateComponent;
  let fixture: ComponentFixture<SupplierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let supplierFormService: SupplierFormService;
  let supplierService: SupplierService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SupplierUpdateComponent],
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
      .overrideTemplate(SupplierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupplierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    supplierFormService = TestBed.inject(SupplierFormService);
    supplierService = TestBed.inject(SupplierService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Company query and add missing value', () => {
      const supplier: ISupplier = { id: 456 };
      const company: ICompany = { id: 40383 };
      supplier.company = company;

      const companyCollection: ICompany[] = [{ id: 90553 }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ supplier });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const supplier: ISupplier = { id: 456 };
      const company: ICompany = { id: 76449 };
      supplier.company = company;

      activatedRoute.data = of({ supplier });
      comp.ngOnInit();

      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.supplier).toEqual(supplier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplier>>();
      const supplier = { id: 123 };
      jest.spyOn(supplierFormService, 'getSupplier').mockReturnValue(supplier);
      jest.spyOn(supplierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplier }));
      saveSubject.complete();

      // THEN
      expect(supplierFormService.getSupplier).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(supplierService.update).toHaveBeenCalledWith(expect.objectContaining(supplier));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplier>>();
      const supplier = { id: 123 };
      jest.spyOn(supplierFormService, 'getSupplier').mockReturnValue({ id: null });
      jest.spyOn(supplierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplier: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplier }));
      saveSubject.complete();

      // THEN
      expect(supplierFormService.getSupplier).toHaveBeenCalled();
      expect(supplierService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplier>>();
      const supplier = { id: 123 };
      jest.spyOn(supplierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(supplierService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
