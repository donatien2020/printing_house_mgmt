import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserDivisionEnrolmentFormService } from './user-division-enrolment-form.service';
import { UserDivisionEnrolmentService } from '../service/user-division-enrolment.service';
import { IUserDivisionEnrolment } from '../user-division-enrolment.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDivision } from 'app/entities/division/division.model';
import { DivisionService } from 'app/entities/division/service/division.service';

import { UserDivisionEnrolmentUpdateComponent } from './user-division-enrolment-update.component';

describe('UserDivisionEnrolment Management Update Component', () => {
  let comp: UserDivisionEnrolmentUpdateComponent;
  let fixture: ComponentFixture<UserDivisionEnrolmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userDivisionEnrolmentFormService: UserDivisionEnrolmentFormService;
  let userDivisionEnrolmentService: UserDivisionEnrolmentService;
  let pUserService: PUserService;
  let divisionService: DivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserDivisionEnrolmentUpdateComponent],
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
      .overrideTemplate(UserDivisionEnrolmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDivisionEnrolmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userDivisionEnrolmentFormService = TestBed.inject(UserDivisionEnrolmentFormService);
    userDivisionEnrolmentService = TestBed.inject(UserDivisionEnrolmentService);
    pUserService = TestBed.inject(PUserService);
    divisionService = TestBed.inject(DivisionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PUser query and add missing value', () => {
      const userDivisionEnrolment: IUserDivisionEnrolment = { id: 456 };
      const user: IPUser = { id: 4817 };
      userDivisionEnrolment.user = user;

      const pUserCollection: IPUser[] = [{ id: 41225 }];
      jest.spyOn(pUserService, 'query').mockReturnValue(of(new HttpResponse({ body: pUserCollection })));
      const additionalPUsers = [user];
      const expectedCollection: IPUser[] = [...additionalPUsers, ...pUserCollection];
      jest.spyOn(pUserService, 'addPUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDivisionEnrolment });
      comp.ngOnInit();

      expect(pUserService.query).toHaveBeenCalled();
      expect(pUserService.addPUserToCollectionIfMissing).toHaveBeenCalledWith(
        pUserCollection,
        ...additionalPUsers.map(expect.objectContaining)
      );
      expect(comp.pUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Division query and add missing value', () => {
      const userDivisionEnrolment: IUserDivisionEnrolment = { id: 456 };
      const division: IDivision = { id: 2341 };
      userDivisionEnrolment.division = division;

      const divisionCollection: IDivision[] = [{ id: 21821 }];
      jest.spyOn(divisionService, 'query').mockReturnValue(of(new HttpResponse({ body: divisionCollection })));
      const additionalDivisions = [division];
      const expectedCollection: IDivision[] = [...additionalDivisions, ...divisionCollection];
      jest.spyOn(divisionService, 'addDivisionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDivisionEnrolment });
      comp.ngOnInit();

      expect(divisionService.query).toHaveBeenCalled();
      expect(divisionService.addDivisionToCollectionIfMissing).toHaveBeenCalledWith(
        divisionCollection,
        ...additionalDivisions.map(expect.objectContaining)
      );
      expect(comp.divisionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userDivisionEnrolment: IUserDivisionEnrolment = { id: 456 };
      const user: IPUser = { id: 6413 };
      userDivisionEnrolment.user = user;
      const division: IDivision = { id: 60650 };
      userDivisionEnrolment.division = division;

      activatedRoute.data = of({ userDivisionEnrolment });
      comp.ngOnInit();

      expect(comp.pUsersSharedCollection).toContain(user);
      expect(comp.divisionsSharedCollection).toContain(division);
      expect(comp.userDivisionEnrolment).toEqual(userDivisionEnrolment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDivisionEnrolment>>();
      const userDivisionEnrolment = { id: 123 };
      jest.spyOn(userDivisionEnrolmentFormService, 'getUserDivisionEnrolment').mockReturnValue(userDivisionEnrolment);
      jest.spyOn(userDivisionEnrolmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDivisionEnrolment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDivisionEnrolment }));
      saveSubject.complete();

      // THEN
      expect(userDivisionEnrolmentFormService.getUserDivisionEnrolment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userDivisionEnrolmentService.update).toHaveBeenCalledWith(expect.objectContaining(userDivisionEnrolment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDivisionEnrolment>>();
      const userDivisionEnrolment = { id: 123 };
      jest.spyOn(userDivisionEnrolmentFormService, 'getUserDivisionEnrolment').mockReturnValue({ id: null });
      jest.spyOn(userDivisionEnrolmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDivisionEnrolment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDivisionEnrolment }));
      saveSubject.complete();

      // THEN
      expect(userDivisionEnrolmentFormService.getUserDivisionEnrolment).toHaveBeenCalled();
      expect(userDivisionEnrolmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDivisionEnrolment>>();
      const userDivisionEnrolment = { id: 123 };
      jest.spyOn(userDivisionEnrolmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDivisionEnrolment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userDivisionEnrolmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePUser', () => {
      it('Should forward to pUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pUserService, 'comparePUser');
        comp.comparePUser(entity, entity2);
        expect(pUserService.comparePUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDivision', () => {
      it('Should forward to divisionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(divisionService, 'compareDivision');
        comp.compareDivision(entity, entity2);
        expect(divisionService.compareDivision).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
