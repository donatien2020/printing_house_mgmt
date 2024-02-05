import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DivisionFormService } from './division-form.service';
import { DivisionService } from '../service/division.service';
import { IDivision } from '../division.model';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { POrganizationService } from 'app/entities/p-organization/service/p-organization.service';

import { DivisionUpdateComponent } from './division-update.component';

describe('Division Management Update Component', () => {
  let comp: DivisionUpdateComponent;
  let fixture: ComponentFixture<DivisionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let divisionFormService: DivisionFormService;
  let divisionService: DivisionService;
  let pOrganizationService: POrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DivisionUpdateComponent],
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
      .overrideTemplate(DivisionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DivisionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    divisionFormService = TestBed.inject(DivisionFormService);
    divisionService = TestBed.inject(DivisionService);
    pOrganizationService = TestBed.inject(POrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Division query and add missing value', () => {
      const division: IDivision = { id: 456 };
      const parent: IDivision = { id: 48024 };
      division.parent = parent;

      const divisionCollection: IDivision[] = [{ id: 4888 }];
      jest.spyOn(divisionService, 'query').mockReturnValue(of(new HttpResponse({ body: divisionCollection })));
      const additionalDivisions = [parent];
      const expectedCollection: IDivision[] = [...additionalDivisions, ...divisionCollection];
      jest.spyOn(divisionService, 'addDivisionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ division });
      comp.ngOnInit();

      expect(divisionService.query).toHaveBeenCalled();
      expect(divisionService.addDivisionToCollectionIfMissing).toHaveBeenCalledWith(
        divisionCollection,
        ...additionalDivisions.map(expect.objectContaining)
      );
      expect(comp.divisionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call POrganization query and add missing value', () => {
      const division: IDivision = { id: 456 };
      const organization: IPOrganization = { id: 52374 };
      division.organization = organization;

      const pOrganizationCollection: IPOrganization[] = [{ id: 84149 }];
      jest.spyOn(pOrganizationService, 'query').mockReturnValue(of(new HttpResponse({ body: pOrganizationCollection })));
      const additionalPOrganizations = [organization];
      const expectedCollection: IPOrganization[] = [...additionalPOrganizations, ...pOrganizationCollection];
      jest.spyOn(pOrganizationService, 'addPOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ division });
      comp.ngOnInit();

      expect(pOrganizationService.query).toHaveBeenCalled();
      expect(pOrganizationService.addPOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        pOrganizationCollection,
        ...additionalPOrganizations.map(expect.objectContaining)
      );
      expect(comp.pOrganizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const division: IDivision = { id: 456 };
      const parent: IDivision = { id: 10939 };
      division.parent = parent;
      const organization: IPOrganization = { id: 6397 };
      division.organization = organization;

      activatedRoute.data = of({ division });
      comp.ngOnInit();

      expect(comp.divisionsSharedCollection).toContain(parent);
      expect(comp.pOrganizationsSharedCollection).toContain(organization);
      expect(comp.division).toEqual(division);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDivision>>();
      const division = { id: 123 };
      jest.spyOn(divisionFormService, 'getDivision').mockReturnValue(division);
      jest.spyOn(divisionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ division });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: division }));
      saveSubject.complete();

      // THEN
      expect(divisionFormService.getDivision).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(divisionService.update).toHaveBeenCalledWith(expect.objectContaining(division));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDivision>>();
      const division = { id: 123 };
      jest.spyOn(divisionFormService, 'getDivision').mockReturnValue({ id: null });
      jest.spyOn(divisionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ division: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: division }));
      saveSubject.complete();

      // THEN
      expect(divisionFormService.getDivision).toHaveBeenCalled();
      expect(divisionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDivision>>();
      const division = { id: 123 };
      jest.spyOn(divisionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ division });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(divisionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDivision', () => {
      it('Should forward to divisionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(divisionService, 'compareDivision');
        comp.compareDivision(entity, entity2);
        expect(divisionService.compareDivision).toHaveBeenCalledWith(entity, entity2);
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
