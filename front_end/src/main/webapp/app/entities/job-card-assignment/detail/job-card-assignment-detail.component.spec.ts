import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobCardAssignmentDetailComponent } from './job-card-assignment-detail.component';

describe('JobCardAssignment Management Detail Component', () => {
  let comp: JobCardAssignmentDetailComponent;
  let fixture: ComponentFixture<JobCardAssignmentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCardAssignmentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ jobCardAssignment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JobCardAssignmentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JobCardAssignmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load jobCardAssignment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.jobCardAssignment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
