import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PayRollItemService } from '../service/pay-roll-item.service';

import { PayRollItemComponent } from './pay-roll-item.component';

describe('PayRollItem Management Component', () => {
  let comp: PayRollItemComponent;
  let fixture: ComponentFixture<PayRollItemComponent>;
  let service: PayRollItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pay-roll-item', component: PayRollItemComponent }]), HttpClientTestingModule],
      declarations: [PayRollItemComponent],
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
      .overrideTemplate(PayRollItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayRollItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PayRollItemService);

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
    expect(comp.payRollItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to payRollItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPayRollItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPayRollItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
