import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobCardDetailComponent } from './job-card-detail.component';

describe('JobCard Management Detail Component', () => {
  let comp: JobCardDetailComponent;
  let fixture: ComponentFixture<JobCardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ jobCard: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JobCardDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JobCardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load jobCard on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.jobCard).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
