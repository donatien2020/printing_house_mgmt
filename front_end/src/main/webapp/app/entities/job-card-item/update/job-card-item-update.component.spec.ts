import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobCardItemFormService } from './job-card-item-form.service';
import { JobCardItemService } from '../service/job-card-item.service';
import { IJobCardItem } from '../job-card-item.model';
import { IJobCard } from 'app/entities/job-card/job-card.model';
import { JobCardService } from 'app/entities/job-card/service/job-card.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { JobCardItemUpdateComponent } from './job-card-item-update.component';

describe('JobCardItem Management Update Component', () => {
  let comp: JobCardItemUpdateComponent;
  let fixture: ComponentFixture<JobCardItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobCardItemFormService: JobCardItemFormService;
  let jobCardItemService: JobCardItemService;
  let jobCardService: JobCardService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobCardItemUpdateComponent],
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
      .overrideTemplate(JobCardItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobCardItemFormService = TestBed.inject(JobCardItemFormService);
    jobCardItemService = TestBed.inject(JobCardItemService);
    jobCardService = TestBed.inject(JobCardService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call JobCard query and add missing value', () => {
      const jobCardItem: IJobCardItem = { id: 456 };
      const card: IJobCard = { id: 23373 };
      jobCardItem.card = card;

      const jobCardCollection: IJobCard[] = [{ id: 92902 }];
      jest.spyOn(jobCardService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCardCollection })));
      const additionalJobCards = [card];
      const expectedCollection: IJobCard[] = [...additionalJobCards, ...jobCardCollection];
      jest.spyOn(jobCardService, 'addJobCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobCardItem });
      comp.ngOnInit();

      expect(jobCardService.query).toHaveBeenCalled();
      expect(jobCardService.addJobCardToCollectionIfMissing).toHaveBeenCalledWith(
        jobCardCollection,
        ...additionalJobCards.map(expect.objectContaining)
      );
      expect(comp.jobCardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const jobCardItem: IJobCardItem = { id: 456 };
      const product: IProduct = { id: 32982 };
      jobCardItem.product = product;

      const productCollection: IProduct[] = [{ id: 69287 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobCardItem });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(
        productCollection,
        ...additionalProducts.map(expect.objectContaining)
      );
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jobCardItem: IJobCardItem = { id: 456 };
      const card: IJobCard = { id: 46770 };
      jobCardItem.card = card;
      const product: IProduct = { id: 65948 };
      jobCardItem.product = product;

      activatedRoute.data = of({ jobCardItem });
      comp.ngOnInit();

      expect(comp.jobCardsSharedCollection).toContain(card);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.jobCardItem).toEqual(jobCardItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardItem>>();
      const jobCardItem = { id: 123 };
      jest.spyOn(jobCardItemFormService, 'getJobCardItem').mockReturnValue(jobCardItem);
      jest.spyOn(jobCardItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCardItem }));
      saveSubject.complete();

      // THEN
      expect(jobCardItemFormService.getJobCardItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobCardItemService.update).toHaveBeenCalledWith(expect.objectContaining(jobCardItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardItem>>();
      const jobCardItem = { id: 123 };
      jest.spyOn(jobCardItemFormService, 'getJobCardItem').mockReturnValue({ id: null });
      jest.spyOn(jobCardItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCardItem }));
      saveSubject.complete();

      // THEN
      expect(jobCardItemFormService.getJobCardItem).toHaveBeenCalled();
      expect(jobCardItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCardItem>>();
      const jobCardItem = { id: 123 };
      jest.spyOn(jobCardItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCardItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobCardItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobCard', () => {
      it('Should forward to jobCardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(jobCardService, 'compareJobCard');
        comp.compareJobCard(entity, entity2);
        expect(jobCardService.compareJobCard).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProduct', () => {
      it('Should forward to productService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productService, 'compareProduct');
        comp.compareProduct(entity, entity2);
        expect(productService.compareProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
