import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DeliveryService } from '../service/delivery.service';

import { DeliveryComponent } from './delivery.component';

describe('Delivery Management Component', () => {
  let comp: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let service: DeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'delivery', component: DeliveryComponent }]), HttpClientTestingModule],
      declarations: [DeliveryComponent],
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
      .overrideTemplate(DeliveryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DeliveryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DeliveryService);

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
    expect(comp.deliveries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to deliveryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDeliveryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDeliveryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
