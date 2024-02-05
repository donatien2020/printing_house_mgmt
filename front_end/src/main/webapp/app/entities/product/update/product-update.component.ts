import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductFormService, ProductFormGroup } from './product-form.service';
import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { IPOrganization } from 'app/entities/p-organization/p-organization.model';
import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { ProductCategoryService } from 'app/entities/product-category/service/product-category.service';
import { POrganizationService } from 'app/entities/p-organization/service/p-organization.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;
  statusValues = Object.keys(Status);
  categoriesSharedCollection: IProductCategory[] = [];
  organizationsSharedCollection: IPOrganization[] = [];

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  constructor(
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected activatedRoute: ActivatedRoute,
    protected productCategoryService: ProductCategoryService,
    protected pOrganizationService: POrganizationService

  ) {}

  compareCategory = (o1: IProductCategory | null, o2: IProductCategory | null): boolean => this.productCategoryService.compareProductCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }
       this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);
    this.categoriesSharedCollection = this.productCategoryService.addProductCategoryToCollectionIfMissing<IProductCategory>(
    this.categoriesSharedCollection,
    product.category
    );

  }
 protected loadRelationshipsOptions(): void {
    this.productCategoryService
      .query()
      .pipe(map((res: HttpResponse<IProductCategory[]>) => res.body ?? []))
      .pipe(
        map((productCategories: IProductCategory[]) =>
          this.productCategoryService.addProductCategoryToCollectionIfMissing<IProductCategory>(
            productCategories,
            this.product?.category
          )
        )
      ).subscribe((productCategories: IProductCategory[]) => (this.categoriesSharedCollection = productCategories));

  }
}

