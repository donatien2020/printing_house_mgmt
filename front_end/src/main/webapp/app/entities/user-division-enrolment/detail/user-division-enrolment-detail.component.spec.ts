import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserDivisionEnrolmentDetailComponent } from './user-division-enrolment-detail.component';

describe('UserDivisionEnrolment Management Detail Component', () => {
  let comp: UserDivisionEnrolmentDetailComponent;
  let fixture: ComponentFixture<UserDivisionEnrolmentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDivisionEnrolmentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userDivisionEnrolment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserDivisionEnrolmentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserDivisionEnrolmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userDivisionEnrolment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userDivisionEnrolment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
