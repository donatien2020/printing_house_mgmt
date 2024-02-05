import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InvoiceItemDetailComponent } from './invoice-item-detail.component';

describe('InvoiceItem Management Detail Component', () => {
  let comp: InvoiceItemDetailComponent;
  let fixture: ComponentFixture<InvoiceItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ invoiceItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InvoiceItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InvoiceItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load invoiceItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.invoiceItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
