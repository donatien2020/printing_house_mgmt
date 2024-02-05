import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InvoiceHistoryDetailComponent } from './invoice-history-detail.component';

describe('InvoiceHistory Management Detail Component', () => {
  let comp: InvoiceHistoryDetailComponent;
  let fixture: ComponentFixture<InvoiceHistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceHistoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ invoiceHistory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InvoiceHistoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InvoiceHistoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load invoiceHistory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.invoiceHistory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
