import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { POrganizationFormService } from './p-organization-form.service';
import { POrganizationService } from '../service/p-organization.service';
import { IPOrganization } from '../p-organization.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { POrganizationUpdateComponent } from './p-organization-update.component';

describe('POrganization Management Update Component', () => {
  let comp: POrganizationUpdateComponent;
  let fixture: ComponentFixture<POrganizationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pOrganizationFormService: POrganizationFormService;
  let pOrganizationService: POrganizationService;
  let companyService: CompanyService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [POrganizationUpdateComponent],
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
      .overrideTemplate(POrganizationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(POrganizationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pOrganizationFormService = TestBed.inject(POrganizationFormService);
    pOrganizationService = TestBed.inject(POrganizationService);
    companyService = TestBed.inject(CompanyService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call POrganization query and add missing value', () => {
      const pOrganization: IPOrganization = { id: 456 };
      const parent: IPOrganization = { id: 77917 };
      pOrganization.parent = parent;

      const pOrganizationCollection: IPOrganization[] = [{ id: 62700 }];
      jest.spyOn(pOrganizationService, 'query').mockReturnValue(of(new HttpResponse({ body: pOrganizationCollection })));
      const additionalPOrganizations = [parent];
      const expectedCollection: IPOrganization[] = [...additionalPOrganizations, ...pOrganizationCollection];
      jest.spyOn(pOrganizationService, 'addPOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      expect(pOrganizationService.query).toHaveBeenCalled();
      expect(pOrganizationService.addPOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        pOrganizationCollection,
        ...additionalPOrganizations.map(expect.objectContaining)
      );
      expect(comp.pOrganizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const pOrganization: IPOrganization = { id: 456 };
      const company: ICompany = { id: 13691 };
      pOrganization.company = company;

      const companyCollection: ICompany[] = [{ id: 18759 }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Location query and add missing value', () => {
      const pOrganization: IPOrganization = { id: 456 };
      const officeLocation: ILocation = { id: 87551 };
      pOrganization.officeLocation = officeLocation;

      const locationCollection: ILocation[] = [{ id: 15873 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [officeLocation];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining)
      );
      expect(comp.locationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pOrganization: IPOrganization = { id: 456 };
      const parent: IPOrganization = { id: 56928 };
      pOrganization.parent = parent;
      const company: ICompany = { id: 36829 };
      pOrganization.company = company;
      const officeLocation: ILocation = { id: 72840 };
      pOrganization.officeLocation = officeLocation;

      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      expect(comp.pOrganizationsSharedCollection).toContain(parent);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.locationsSharedCollection).toContain(officeLocation);
      expect(comp.pOrganization).toEqual(pOrganization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPOrganization>>();
      const pOrganization = { id: 123 };
      jest.spyOn(pOrganizationFormService, 'getPOrganization').mockReturnValue(pOrganization);
      jest.spyOn(pOrganizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pOrganization }));
      saveSubject.complete();

      // THEN
      expect(pOrganizationFormService.getPOrganization).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pOrganizationService.update).toHaveBeenCalledWith(expect.objectContaining(pOrganization));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPOrganization>>();
      const pOrganization = { id: 123 };
      jest.spyOn(pOrganizationFormService, 'getPOrganization').mockReturnValue({ id: null });
      jest.spyOn(pOrganizationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pOrganization: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pOrganization }));
      saveSubject.complete();

      // THEN
      expect(pOrganizationFormService.getPOrganization).toHaveBeenCalled();
      expect(pOrganizationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPOrganization>>();
      const pOrganization = { id: 123 };
      jest.spyOn(pOrganizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pOrganization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pOrganizationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePOrganization', () => {
      it('Should forward to pOrganizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pOrganizationService, 'comparePOrganization');
        comp.comparePOrganization(entity, entity2);
        expect(pOrganizationService.comparePOrganization).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
