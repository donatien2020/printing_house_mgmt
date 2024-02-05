import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinancialClientEngagementDetailComponent } from './financial-client-engagement-detail.component';

describe('FinancialClientEngagement Management Detail Component', () => {
  let comp: FinancialClientEngagementDetailComponent;
  let fixture: ComponentFixture<FinancialClientEngagementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialClientEngagementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ financialClientEngagement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinancialClientEngagementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinancialClientEngagementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load financialClientEngagement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.financialClientEngagement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
