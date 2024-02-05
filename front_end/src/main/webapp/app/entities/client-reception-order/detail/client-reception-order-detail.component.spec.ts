import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClientReceptionOrderDetailComponent } from './client-reception-order-detail.component';

describe('ClientReceptionOrder Management Detail Component', () => {
  let comp: ClientReceptionOrderDetailComponent;
  let fixture: ComponentFixture<ClientReceptionOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientReceptionOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ clientReceptionOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClientReceptionOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClientReceptionOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load clientReceptionOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.clientReceptionOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
