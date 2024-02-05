import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobCardFormService } from './job-card-form.service';
import { JobCardService } from '../service/job-card.service';
import { IJobCard } from '../job-card.model';
import { IClientReceptionOrder } from 'app/entities/client-reception-order/client-reception-order.model';
import { ClientReceptionOrderService } from 'app/entities/client-reception-order/service/client-reception-order.service';

import { JobCardUpdateComponent } from './job-card-update.component';

describe('JobCard Management Update Component', () => {
  let comp: JobCardUpdateComponent;
  let fixture: ComponentFixture<JobCardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobCardFormService: JobCardFormService;
  let jobCardService: JobCardService;
  let clientReceptionOrderService: ClientReceptionOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobCardUpdateComponent],
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
      .overrideTemplate(JobCardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobCardFormService = TestBed.inject(JobCardFormService);
    jobCardService = TestBed.inject(JobCardService);
    clientReceptionOrderService = TestBed.inject(ClientReceptionOrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ClientReceptionOrder query and add missing value', () => {
      const jobCard: IJobCard = { id: 456 };
      const clientReceptionOrder: IClientReceptionOrder = { id: 40001 };
      jobCard.clientReceptionOrder = clientReceptionOrder;

      const clientReceptionOrderCollection: IClientReceptionOrder[] = [{ id: 21390 }];
      jest.spyOn(clientReceptionOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: clientReceptionOrderCollection })));
      const additionalClientReceptionOrders = [clientReceptionOrder];
      const expectedCollection: IClientReceptionOrder[] = [...additionalClientReceptionOrders, ...clientReceptionOrderCollection];
      jest.spyOn(clientReceptionOrderService, 'addClientReceptionOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      expect(clientReceptionOrderService.query).toHaveBeenCalled();
      expect(clientReceptionOrderService.addClientReceptionOrderToCollectionIfMissing).toHaveBeenCalledWith(
        clientReceptionOrderCollection,
        ...additionalClientReceptionOrders.map(expect.objectContaining)
      );
      expect(comp.clientReceptionOrdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jobCard: IJobCard = { id: 456 };
      const clientReceptionOrder: IClientReceptionOrder = { id: 81009 };
      jobCard.clientReceptionOrder = clientReceptionOrder;

      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      expect(comp.clientReceptionOrdersSharedCollection).toContain(clientReceptionOrder);
      expect(comp.jobCard).toEqual(jobCard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 123 };
      jest.spyOn(jobCardFormService, 'getJobCard').mockReturnValue(jobCard);
      jest.spyOn(jobCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCard }));
      saveSubject.complete();

      // THEN
      expect(jobCardFormService.getJobCard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobCardService.update).toHaveBeenCalledWith(expect.objectContaining(jobCard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 123 };
      jest.spyOn(jobCardFormService, 'getJobCard').mockReturnValue({ id: null });
      jest.spyOn(jobCardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCard }));
      saveSubject.complete();

      // THEN
      expect(jobCardFormService.getJobCard).toHaveBeenCalled();
      expect(jobCardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 123 };
      jest.spyOn(jobCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobCardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClientReceptionOrder', () => {
      it('Should forward to clientReceptionOrderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientReceptionOrderService, 'compareClientReceptionOrder');
        comp.compareClientReceptionOrder(entity, entity2);
        expect(clientReceptionOrderService.compareClientReceptionOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
