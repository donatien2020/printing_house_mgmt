import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LocationFormService } from './location-form.service';
import { LocationService } from '../service/location.service';
import { ILocation } from '../location.model';
import { ILocationLevel } from 'app/entities/location-level/location-level.model';
import { LocationLevelService } from 'app/entities/location-level/service/location-level.service';

import { LocationUpdateComponent } from './location-update.component';

describe('Location Management Update Component', () => {
  let comp: LocationUpdateComponent;
  let fixture: ComponentFixture<LocationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let locationFormService: LocationFormService;
  let locationService: LocationService;
  let locationLevelService: LocationLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LocationUpdateComponent],
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
      .overrideTemplate(LocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    locationFormService = TestBed.inject(LocationFormService);
    locationService = TestBed.inject(LocationService);
    locationLevelService = TestBed.inject(LocationLevelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Location query and add missing value', () => {
      const location: ILocation = { id: 456 };
      const parent: ILocation = { id: 83607 };
      location.parent = parent;

      const locationCollection: ILocation[] = [{ id: 19644 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [parent];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining)
      );
      expect(comp.locationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LocationLevel query and add missing value', () => {
      const location: ILocation = { id: 456 };
      const level: ILocationLevel = { id: 98556 };
      location.level = level;

      const locationLevelCollection: ILocationLevel[] = [{ id: 29569 }];
      jest.spyOn(locationLevelService, 'query').mockReturnValue(of(new HttpResponse({ body: locationLevelCollection })));
      const additionalLocationLevels = [level];
      const expectedCollection: ILocationLevel[] = [...additionalLocationLevels, ...locationLevelCollection];
      jest.spyOn(locationLevelService, 'addLocationLevelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(locationLevelService.query).toHaveBeenCalled();
      expect(locationLevelService.addLocationLevelToCollectionIfMissing).toHaveBeenCalledWith(
        locationLevelCollection,
        ...additionalLocationLevels.map(expect.objectContaining)
      );
      expect(comp.locationLevelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const location: ILocation = { id: 456 };
      const parent: ILocation = { id: 1584 };
      location.parent = parent;
      const level: ILocationLevel = { id: 2272 };
      location.level = level;

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(comp.locationsSharedCollection).toContain(parent);
      expect(comp.locationLevelsSharedCollection).toContain(level);
      expect(comp.location).toEqual(location);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue(location);
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue({ id: null });
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLocationLevel', () => {
      it('Should forward to locationLevelService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationLevelService, 'compareLocationLevel');
        comp.compareLocationLevel(entity, entity2);
        expect(locationLevelService.compareLocationLevel).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
