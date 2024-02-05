import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LocationLevelService } from '../service/location-level.service';

import { LocationLevelComponent } from './location-level.component';

describe('LocationLevel Management Component', () => {
  let comp: LocationLevelComponent;
  let fixture: ComponentFixture<LocationLevelComponent>;
  let service: LocationLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'location-level', component: LocationLevelComponent }]), HttpClientTestingModule],
      declarations: [LocationLevelComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LocationLevelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationLevelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LocationLevelService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.locationLevels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to locationLevelService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLocationLevelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLocationLevelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
