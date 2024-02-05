import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduct, NewProduct } from '../product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduct for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = IProduct | PartialWithRequiredKeyOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id'>;

type ProductFormGroupContent = {
  id: FormControl<IProduct['id'] | NewProduct['id']>;
  code: FormControl<IProduct['code']>;
  name: FormControl<IProduct['name']>;
  description: FormControl<IProduct['description']>;
  unitSalesPrice: FormControl<IProduct['unitSalesPrice']>;
  unitPurchaseCost: FormControl<IProduct['unitPurchaseCost']>;
  category: FormControl<IProduct['category']>;
  status: FormControl<IProduct['status']>;
};

export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = {
      ...this.getFormDefaults(),
      ...product,
    };
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      category: new FormControl(productRawValue.category, {
        validators: [Validators.required],
      }),
      code: new FormControl(productRawValue.code, {
        validators: [Validators.required],
      }),
      name: new FormControl(productRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(productRawValue.description, {
        validators: [Validators.required],
      }),
      unitSalesPrice: new FormControl(productRawValue.unitSalesPrice, {
        validators: [Validators.required],
      }),
      unitPurchaseCost: new FormControl(productRawValue.unitPurchaseCost, {
        validators: [Validators.required],
      }),
      status: new FormControl(productRawValue.status, {
        validators: [Validators.required],
      }),
    });
  }

  getProduct(form: ProductFormGroup): IProduct | NewProduct {
    return form.getRawValue() as IProduct | NewProduct;
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = { ...this.getFormDefaults(), ...product };
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    return {
      id: null,
    };
  }
}
