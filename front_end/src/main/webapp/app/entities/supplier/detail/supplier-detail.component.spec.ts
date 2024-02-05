import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SupplierDetailComponent } from './supplier-detail.component';

describe('Supplier Management Detail Component', () => {
  let comp: SupplierDetailComponent;
  let fixture: ComponentFixture<SupplierDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ supplier: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SupplierDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SupplierDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load supplier on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.supplier).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
