import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DebtorDetailComponent } from './debtor-detail.component';

describe('Debtor Management Detail Component', () => {
  let comp: DebtorDetailComponent;
  let fixture: ComponentFixture<DebtorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebtorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ debtor: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DebtorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DebtorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load debtor on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.debtor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
