import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReceiptDetailComponent } from './receipt-detail.component';

describe('Receipt Management Detail Component', () => {
  let comp: ReceiptDetailComponent;
  let fixture: ComponentFixture<ReceiptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ receipt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReceiptDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReceiptDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load receipt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.receipt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
