import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SupplierService } from '../service/supplier.service';

import { SupplierComponent } from './supplier.component';

describe('Supplier Management Component', () => {
  let comp: SupplierComponent;
  let fixture: ComponentFixture<SupplierComponent>;
  let service: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'supplier', component: SupplierComponent }]), HttpClientTestingModule],
      declarations: [SupplierComponent],
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
      .overrideTemplate(SupplierComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupplierComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SupplierService);

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
    expect(comp.suppliers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to supplierService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSupplierIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSupplierIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
