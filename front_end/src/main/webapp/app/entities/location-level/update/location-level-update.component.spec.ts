import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LocationLevelFormService } from './location-level-form.service';
import { LocationLevelService } from '../service/location-level.service';
import { ILocationLevel } from '../location-level.model';

import { LocationLevelUpdateComponent } from './location-level-update.component';

describe('LocationLevel Management Update Component', () => {
  let comp: LocationLevelUpdateComponent;
  let fixture: ComponentFixture<LocationLevelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let locationLevelFormService: LocationLevelFormService;
  let locationLevelService: LocationLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LocationLevelUpdateComponent],
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
      .overrideTemplate(LocationLevelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationLevelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    locationLevelFormService = TestBed.inject(LocationLevelFormService);
    locationLevelService = TestBed.inject(LocationLevelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const locationLevel: ILocationLevel = { id: 456 };

      activatedRoute.data = of({ locationLevel });
      comp.ngOnInit();

      expect(comp.locationLevel).toEqual(locationLevel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationLevel>>();
      const locationLevel = { id: 123 };
      jest.spyOn(locationLevelFormService, 'getLocationLevel').mockReturnValue(locationLevel);
      jest.spyOn(locationLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ locationLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: locationLevel }));
      saveSubject.complete();

      // THEN
      expect(locationLevelFormService.getLocationLevel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationLevelService.update).toHaveBeenCalledWith(expect.objectContaining(locationLevel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationLevel>>();
      const locationLevel = { id: 123 };
      jest.spyOn(locationLevelFormService, 'getLocationLevel').mockReturnValue({ id: null });
      jest.spyOn(locationLevelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ locationLevel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: locationLevel }));
      saveSubject.complete();

      // THEN
      expect(locationLevelFormService.getLocationLevel).toHaveBeenCalled();
      expect(locationLevelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationLevel>>();
      const locationLevel = { id: 123 };
      jest.spyOn(locationLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ locationLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationLevelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
