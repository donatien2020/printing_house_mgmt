import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PayRollDetailComponent } from './pay-roll-detail.component';

describe('PayRoll Management Detail Component', () => {
  let comp: PayRollDetailComponent;
  let fixture: ComponentFixture<PayRollDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayRollDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ payRoll: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PayRollDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PayRollDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load payRoll on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.payRoll).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
