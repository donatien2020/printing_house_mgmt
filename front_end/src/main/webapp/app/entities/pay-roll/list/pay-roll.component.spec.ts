import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PayRollService } from '../service/pay-roll.service';

import { PayRollComponent } from './pay-roll.component';

describe('PayRoll Management Component', () => {
  let comp: PayRollComponent;
  let fixture: ComponentFixture<PayRollComponent>;
  let service: PayRollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pay-roll', component: PayRollComponent }]), HttpClientTestingModule],
      declarations: [PayRollComponent],
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
      .overrideTemplate(PayRollComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayRollComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PayRollService);

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
    expect(comp.payRolls?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to payRollService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPayRollIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPayRollIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
