import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';

import { FinancialClientEngagementComponent } from './financial-client-engagement.component';

describe('FinancialClientEngagement Management Component', () => {
  let comp: FinancialClientEngagementComponent;
  let fixture: ComponentFixture<FinancialClientEngagementComponent>;
  let service: FinancialClientEngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'financial-client-engagement', component: FinancialClientEngagementComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [FinancialClientEngagementComponent],
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
      .overrideTemplate(FinancialClientEngagementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinancialClientEngagementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FinancialClientEngagementService);

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
    expect(comp.financialClientEngagements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to financialClientEngagementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFinancialClientEngagementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFinancialClientEngagementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
