import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthoTrackerService } from '../service/autho-tracker.service';

import { AuthoTrackerComponent } from './autho-tracker.component';

describe('AuthoTracker Management Component', () => {
  let comp: AuthoTrackerComponent;
  let fixture: ComponentFixture<AuthoTrackerComponent>;
  let service: AuthoTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'autho-tracker', component: AuthoTrackerComponent }]), HttpClientTestingModule],
      declarations: [AuthoTrackerComponent],
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
      .overrideTemplate(AuthoTrackerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthoTrackerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AuthoTrackerService);

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
    expect(comp.authoTrackers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to authoTrackerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAuthoTrackerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAuthoTrackerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
