import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProductComponent } from './list/product.component';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductUpdateComponent } from './update/product-update.component';
import ProductResolve from './route/product-routing-resolve.service';

const productRoute: Routes = [
  {
    path: '',
    component: ProductComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductDetailComponent,
    resolve: {
      product: ProductResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default productRoute;
