import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductCategoryFormService } from './product-category-form.service';
import { ProductCategoryService } from '../service/product-category.service';
import { IProductCategory } from '../product-category.model';

import { ProductCategoryUpdateComponent } from './product-category-update.component';

describe('ProductCategory Management Update Component', () => {
  let comp: ProductCategoryUpdateComponent;
  let fixture: ComponentFixture<ProductCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productCategoryFormService: ProductCategoryFormService;
  let productCategoryService: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductCategoryUpdateComponent],
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
      .overrideTemplate(ProductCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productCategoryFormService = TestBed.inject(ProductCategoryFormService);
    productCategoryService = TestBed.inject(ProductCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductCategory query and add missing value', () => {
      const productCategory: IProductCategory = { id: 456 };
      const parent: IProductCategory = { id: 76466 };
      productCategory.parent = parent;

      const productCategoryCollection: IProductCategory[] = [{ id: 8756 }];
      jest.spyOn(productCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: productCategoryCollection })));
      const additionalProductCategories = [parent];
      const expectedCollection: IProductCategory[] = [...additionalProductCategories, ...productCategoryCollection];
      jest.spyOn(productCategoryService, 'addProductCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      expect(productCategoryService.query).toHaveBeenCalled();
      expect(productCategoryService.addProductCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        productCategoryCollection,
        ...additionalProductCategories.map(expect.objectContaining)
      );
      expect(comp.productCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productCategory: IProductCategory = { id: 456 };
      const parent: IProductCategory = { id: 61971 };
      productCategory.parent = parent;

      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      expect(comp.productCategoriesSharedCollection).toContain(parent);
      expect(comp.productCategory).toEqual(productCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductCategory>>();
      const productCategory = { id: 123 };
      jest.spyOn(productCategoryFormService, 'getProductCategory').mockReturnValue(productCategory);
      jest.spyOn(productCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCategory }));
      saveSubject.complete();

      // THEN
      expect(productCategoryFormService.getProductCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(productCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductCategory>>();
      const productCategory = { id: 123 };
      jest.spyOn(productCategoryFormService, 'getProductCategory').mockReturnValue({ id: null });
      jest.spyOn(productCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCategory }));
      saveSubject.complete();

      // THEN
      expect(productCategoryFormService.getProductCategory).toHaveBeenCalled();
      expect(productCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductCategory>>();
      const productCategory = { id: 123 };
      jest.spyOn(productCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProductCategory', () => {
      it('Should forward to productCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productCategoryService, 'compareProductCategory');
        comp.compareProductCategory(entity, entity2);
        expect(productCategoryService.compareProductCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
