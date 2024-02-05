import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { POrganizationDetailComponent } from './p-organization-detail.component';

describe('POrganization Management Detail Component', () => {
  let comp: POrganizationDetailComponent;
  let fixture: ComponentFixture<POrganizationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POrganizationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pOrganization: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(POrganizationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(POrganizationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pOrganization on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pOrganization).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
