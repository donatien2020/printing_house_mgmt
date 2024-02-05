import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IClientReceptionOrder } from '../client-reception-order.model';
import { ClientReceptionOrderService } from '../service/client-reception-order.service';

import { ClientReceptionOrderRoutingResolveService } from './client-reception-order-routing-resolve.service';

describe('ClientReceptionOrder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClientReceptionOrderRoutingResolveService;
  let service: ClientReceptionOrderService;
  let resultClientReceptionOrder: IClientReceptionOrder | null | undefined;

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
    routingResolveService = TestBed.inject(ClientReceptionOrderRoutingResolveService);
    service = TestBed.inject(ClientReceptionOrderService);
    resultClientReceptionOrder = undefined;
  });

  describe('resolve', () => {
    it('should return IClientReceptionOrder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientReceptionOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClientReceptionOrder).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientReceptionOrder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClientReceptionOrder).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IClientReceptionOrder>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientReceptionOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClientReceptionOrder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
