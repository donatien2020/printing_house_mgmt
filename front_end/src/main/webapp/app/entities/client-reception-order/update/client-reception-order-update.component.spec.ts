import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClientReceptionOrderFormService } from './client-reception-order-form.service';
import { ClientReceptionOrderService } from '../service/client-reception-order.service';
import { IClientReceptionOrder } from '../client-reception-order.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { ClientReceptionOrderUpdateComponent } from './client-reception-order-update.component';

describe('ClientReceptionOrder Management Update Component', () => {
  let comp: ClientReceptionOrderUpdateComponent;
  let fixture: ComponentFixture<ClientReceptionOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientReceptionOrderFormService: ClientReceptionOrderFormService;
  let clientReceptionOrderService: ClientReceptionOrderService;
  let clientService: ClientService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClientReceptionOrderUpdateComponent],
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
      .overrideTemplate(ClientReceptionOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientReceptionOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientReceptionOrderFormService = TestBed.inject(ClientReceptionOrderFormService);
    clientReceptionOrderService = TestBed.inject(ClientReceptionOrderService);
    clientService = TestBed.inject(ClientService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const clientReceptionOrder: IClientReceptionOrder = { id: 456 };
      const client: IClient = { id: 14285 };
      clientReceptionOrder.client = client;

      const clientCollection: IClient[] = [{ id: 47783 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clientReceptionOrder });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining)
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee query and add missing value', () => {
      const clientReceptionOrder: IClientReceptionOrder = { id: 456 };
      const assignedToEmployee: IEmployee = { id: 13364 };
      clientReceptionOrder.assignedToEmployee = assignedToEmployee;

      const employeeCollection: IEmployee[] = [{ id: 39031 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [assignedToEmployee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clientReceptionOrder });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clientReceptionOrder: IClientReceptionOrder = { id: 456 };
      const client: IClient = { id: 73629 };
      clientReceptionOrder.client = client;
      const assignedToEmployee: IEmployee = { id: 10853 };
      clientReceptionOrder.assignedToEmployee = assignedToEmployee;

      activatedRoute.data = of({ clientReceptionOrder });
      comp.ngOnInit();

      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.employeesSharedCollection).toContain(assignedToEmployee);
      expect(comp.clientReceptionOrder).toEqual(clientReceptionOrder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientReceptionOrder>>();
      const clientReceptionOrder = { id: 123 };
      jest.spyOn(clientReceptionOrderFormService, 'getClientReceptionOrder').mockReturnValue(clientReceptionOrder);
      jest.spyOn(clientReceptionOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientReceptionOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientReceptionOrder }));
      saveSubject.complete();

      // THEN
      expect(clientReceptionOrderFormService.getClientReceptionOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientReceptionOrderService.update).toHaveBeenCalledWith(expect.objectContaining(clientReceptionOrder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientReceptionOrder>>();
      const clientReceptionOrder = { id: 123 };
      jest.spyOn(clientReceptionOrderFormService, 'getClientReceptionOrder').mockReturnValue({ id: null });
      jest.spyOn(clientReceptionOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientReceptionOrder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientReceptionOrder }));
      saveSubject.complete();

      // THEN
      expect(clientReceptionOrderFormService.getClientReceptionOrder).toHaveBeenCalled();
      expect(clientReceptionOrderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientReceptionOrder>>();
      const clientReceptionOrder = { id: 123 };
      jest.spyOn(clientReceptionOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientReceptionOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientReceptionOrderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
