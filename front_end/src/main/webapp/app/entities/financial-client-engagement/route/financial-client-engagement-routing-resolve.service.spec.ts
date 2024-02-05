import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFinancialClientEngagement } from '../financial-client-engagement.model';
import { FinancialClientEngagementService } from '../service/financial-client-engagement.service';

import { FinancialClientEngagementRoutingResolveService } from './financial-client-engagement-routing-resolve.service';

describe('FinancialClientEngagement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FinancialClientEngagementRoutingResolveService;
  let service: FinancialClientEngagementService;
  let resultFinancialClientEngagement: IFinancialClientEngagement | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(FinancialClientEngagementRoutingResolveService);
    service = TestBed.inject(FinancialClientEngagementService);
    resultFinancialClientEngagement = undefined;
  });

  describe('resolve', () => {
    it('should return IFinancialClientEngagement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFinancialClientEngagement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFinancialClientEngagement).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFinancialClientEngagement = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFinancialClientEngagement).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IFinancialClientEngagement>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFinancialClientEngagement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFinancialClientEngagement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
