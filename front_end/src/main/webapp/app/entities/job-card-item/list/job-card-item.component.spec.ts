import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobCardItemService } from '../service/job-card-item.service';

import { JobCardItemComponent } from './job-card-item.component';

describe('JobCardItem Management Component', () => {
  let comp: JobCardItemComponent;
  let fixture: ComponentFixture<JobCardItemComponent>;
  let service: JobCardItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'job-card-item', component: JobCardItemComponent }]), HttpClientTestingModule],
      declarations: [JobCardItemComponent],
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
      .overrideTemplate(JobCardItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JobCardItemService);

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
    expect(comp.jobCardItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to jobCardItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJobCardItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJobCardItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
