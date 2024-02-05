import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PayRollItemDetailComponent } from './pay-roll-item-detail.component';

describe('PayRollItem Management Detail Component', () => {
  let comp: PayRollItemDetailComponent;
  let fixture: ComponentFixture<PayRollItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayRollItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ payRollItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PayRollItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PayRollItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load payRollItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.payRollItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
