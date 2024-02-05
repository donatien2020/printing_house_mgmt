import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthoTrackerDetailComponent } from './autho-tracker-detail.component';

describe('AuthoTracker Management Detail Component', () => {
  let comp: AuthoTrackerDetailComponent;
  let fixture: ComponentFixture<AuthoTrackerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthoTrackerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ authoTracker: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuthoTrackerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuthoTrackerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load authoTracker on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.authoTracker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
