import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InvoiceHistoryService } from '../service/invoice-history.service';

import { InvoiceHistoryComponent } from './invoice-history.component';

describe('InvoiceHistory Management Component', () => {
  let comp: InvoiceHistoryComponent;
  let fixture: ComponentFixture<InvoiceHistoryComponent>;
  let service: InvoiceHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'invoice-history', component: InvoiceHistoryComponent }]), HttpClientTestingModule],
      declarations: [InvoiceHistoryComponent],
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
      .overrideTemplate(InvoiceHistoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceHistoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InvoiceHistoryService);

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
    expect(comp.invoiceHistories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to invoiceHistoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInvoiceHistoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInvoiceHistoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
