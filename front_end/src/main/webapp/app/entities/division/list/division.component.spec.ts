import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DivisionService } from '../service/division.service';

import { DivisionComponent } from './division.component';

describe('Division Management Component', () => {
  let comp: DivisionComponent;
  let fixture: ComponentFixture<DivisionComponent>;
  let service: DivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'division', component: DivisionComponent }]), HttpClientTestingModule],
      declarations: [DivisionComponent],
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
      .overrideTemplate(DivisionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DivisionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DivisionService);

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
    expect(comp.divisions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to divisionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDivisionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDivisionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
