import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClientReceptionOrderService } from '../service/client-reception-order.service';

import { ClientReceptionOrderComponent } from './client-reception-order.component';

describe('ClientReceptionOrder Management Component', () => {
  let comp: ClientReceptionOrderComponent;
  let fixture: ComponentFixture<ClientReceptionOrderComponent>;
  let service: ClientReceptionOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'client-reception-order', component: ClientReceptionOrderComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ClientReceptionOrderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ClientReceptionOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientReceptionOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClientReceptionOrderService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.clientReceptionOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to clientReceptionOrderService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClientReceptionOrderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClientReceptionOrderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
