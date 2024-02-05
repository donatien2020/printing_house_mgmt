import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReceiptService } from '../service/receipt.service';

import { ReceiptComponent } from './receipt.component';

describe('Receipt Management Component', () => {
  let comp: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;
  let service: ReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'receipt', component: ReceiptComponent }]), HttpClientTestingModule],
      declarations: [ReceiptComponent],
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
      .overrideTemplate(ReceiptComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReceiptComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReceiptService);

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
    expect(comp.receipts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to receiptService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReceiptIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReceiptIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
