import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InvoiceFormService } from './invoice-form.service';
import { InvoiceService } from '../service/invoice.service';
import { IInvoice } from '../invoice.model';
import { IDebtor } from 'app/entities/debtor/debtor.model';
import { DebtorService } from 'app/entities/debtor/service/debtor.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { POrganizationService } from 'app/entities/p-organization/service/p-organization.service';

import { InvoiceUpdateComponent } from './invoice-update.component';

describe('Invoice Management Update Component', () => {
  let comp: InvoiceUpdateComponent;
  let fixture: ComponentFixture<InvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let invoiceFormService: InvoiceFormService;
  let invoiceService: InvoiceService;
  let debtorService: DebtorService;
  let clientService: ClientService;
  let pOrganizationService: POrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InvoiceUpdateComponent],
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
      .overrideTemplate(InvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoiceFormService = TestBed.inject(InvoiceFormService);
    invoiceService = TestBed.inject(InvoiceService);
    debtorService = TestBed.inject(DebtorService);
    clientService = TestBed.inject(ClientService);
    pOrganizationService = TestBed.inject(POrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Debtor query and add missing value', () => {
      const invoice: IInvoice = { id: 456 };
      const debtor: IDebtor = { id: 98810 };
      invoice.debtor = debtor;

      const debtorCollection: IDebtor[] = [{ id: 14213 }];
      jest.spyOn(debtorService, 'query').mockReturnValue(of(new HttpResponse({ body: debtorCollection })));
      const additionalDebtors = [debtor];
      const expectedCollection: IDebtor[] = [...additionalDebtors, ...debtorCollection];
      jest.spyOn(debtorService, 'addDebtorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(debtorService.query).toHaveBeenCalled();
      expect(debtorService.addDebtorToCollectionIfMissing).toHaveBeenCalledWith(
        debtorCollection,
        ...additionalDebtors.map(expect.objectContaining)
      );
      expect(comp.debtorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Client query and add missing value', () => {
      const invoice: IInvoice = { id: 456 };
      const invoiceToClient: IClient = { id: 2615 };
      invoice.invoiceToClient = invoiceToClient;

      const clientCollection: IClient[] = [{ id: 30456 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [invoiceToClient];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining)
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call POrganization query and add missing value', () => {
      const invoice: IInvoice = { id: 456 };
      const toOrganization: IPOrganization = { id: 48485 };
      invoice.toOrganization = toOrganization;

      const pOrganizationCollection: IPOrganization[] = [{ id: 90231 }];
      jest.spyOn(pOrganizationService, 'query').mockReturnValue(of(new HttpResponse({ body: pOrganizationCollection })));
      const additionalPOrganizations = [toOrganization];
      const expectedCollection: IPOrganization[] = [...additionalPOrganizations, ...pOrganizationCollection];
      jest.spyOn(pOrganizationService, 'addPOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(pOrganizationService.query).toHaveBeenCalled();
      expect(pOrganizationService.addPOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        pOrganizationCollection,
        ...additionalPOrganizations.map(expect.objectContaining)
      );
      expect(comp.pOrganizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const invoice: IInvoice = { id: 456 };
      const debtor: IDebtor = { id: 10262 };
      invoice.debtor = debtor;
      const invoiceToClient: IClient = { id: 38639 };
      invoice.invoiceToClient = invoiceToClient;
      const toOrganization: IPOrganization = { id: 55148 };
      invoice.toOrganization = toOrganization;

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(comp.debtorsSharedCollection).toContain(debtor);
      expect(comp.clientsSharedCollection).toContain(invoiceToClient);
      expect(comp.pOrganizationsSharedCollection).toContain(toOrganization);
      expect(comp.invoice).toEqual(invoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoice>>();
      const invoice = { id: 123 };
      jest.spyOn(invoiceFormService, 'getInvoice').mockReturnValue(invoice);
      jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoice }));
      saveSubject.complete();

      // THEN
      expect(invoiceFormService.getInvoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoiceService.update).toHaveBeenCalledWith(expect.objectContaining(invoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoice>>();
      const invoice = { id: 123 };
      jest.spyOn(invoiceFormService, 'getInvoice').mockReturnValue({ id: null });
      jest.spyOn(invoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoice }));
      saveSubject.complete();

      // THEN
      expect(invoiceFormService.getInvoice).toHaveBeenCalled();
      expect(invoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoice>>();
      const invoice = { id: 123 };
      jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDebtor', () => {
      it('Should forward to debtorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(debtorService, 'compareDebtor');
        comp.compareDebtor(entity, entity2);
        expect(debtorService.compareDebtor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePOrganization', () => {
      it('Should forward to pOrganizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pOrganizationService, 'comparePOrganization');
        comp.comparePOrganization(entity, entity2);
        expect(pOrganizationService.comparePOrganization).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
