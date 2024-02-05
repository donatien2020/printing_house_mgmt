import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobCardAssignmentService } from '../service/job-card-assignment.service';

import { JobCardAssignmentComponent } from './job-card-assignment.component';

describe('JobCardAssignment Management Component', () => {
  let comp: JobCardAssignmentComponent;
  let fixture: ComponentFixture<JobCardAssignmentComponent>;
  let service: JobCardAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'job-card-assignment', component: JobCardAssignmentComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [JobCardAssignmentComponent],
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
      .overrideTemplate(JobCardAssignmentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardAssignmentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JobCardAssignmentService);

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
    expect(comp.jobCardAssignments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to jobCardAssignmentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJobCardAssignmentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJobCardAssignmentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
