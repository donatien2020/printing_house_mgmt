import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobCardItemDetailComponent } from './job-card-item-detail.component';

describe('JobCardItem Management Detail Component', () => {
  let comp: JobCardItemDetailComponent;
  let fixture: ComponentFixture<JobCardItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCardItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ jobCardItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JobCardItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JobCardItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load jobCardItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.jobCardItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
