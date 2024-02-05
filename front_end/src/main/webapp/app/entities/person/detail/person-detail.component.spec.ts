import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PersonDetailComponent } from './person-detail.component';

describe('Person Management Detail Component', () => {
  let comp: PersonDetailComponent;
  let fixture: ComponentFixture<PersonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ person: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PersonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PersonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load person on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.person).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
