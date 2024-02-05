import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DebtorService } from '../service/debtor.service';

import { DebtorComponent } from './debtor.component';

describe('Debtor Management Component', () => {
  let comp: DebtorComponent;
  let fixture: ComponentFixture<DebtorComponent>;
  let service: DebtorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'debtor', component: DebtorComponent }]), HttpClientTestingModule],
      declarations: [DebtorComponent],
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
      .overrideTemplate(DebtorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DebtorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DebtorService);

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
    expect(comp.debtors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to debtorService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDebtorIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDebtorIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
