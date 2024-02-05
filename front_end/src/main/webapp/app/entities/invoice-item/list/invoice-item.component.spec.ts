import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InvoiceItemService } from '../service/invoice-item.service';

import { InvoiceItemComponent } from './invoice-item.component';

describe('InvoiceItem Management Component', () => {
  let comp: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;
  let service: InvoiceItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'invoice-item', component: InvoiceItemComponent }]), HttpClientTestingModule],
      declarations: [InvoiceItemComponent],
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
      .overrideTemplate(InvoiceItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InvoiceItemService);

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
    expect(comp.invoiceItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to invoiceItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInvoiceItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInvoiceItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
