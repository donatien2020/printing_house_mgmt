import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployee, NewEmployee } from '../employee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmployee for edit and NewEmployeeFormGroupInput for create.
 */
type EmployeeFormGroupInput = IEmployee | PartialWithRequiredKeyOf<NewEmployee>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmployee | NewEmployee> = Omit<T, 'startedOn' | 'terminatedOn'> & {
  startedOn?: string | null;
  terminatedOn?: string | null;
};

type EmployeeFormRawValue = FormValueOf<IEmployee>;

type NewEmployeeFormRawValue = FormValueOf<NewEmployee>;

type EmployeeFormDefaults = Pick<NewEmployee, 'id' | 'startedOn' | 'terminatedOn'>;

type EmployeeFormGroupContent = {
  id: FormControl<EmployeeFormRawValue['id'] | NewEmployee['id']>;
  empNumber: FormControl<EmployeeFormRawValue['empNumber']>;
  description: FormControl<EmployeeFormRawValue['description']>;
  phoneNumber: FormControl<EmployeeFormRawValue['phoneNumber']>;
  email: FormControl<EmployeeFormRawValue['email']>;
  status: FormControl<EmployeeFormRawValue['status']>;
  startedOn: FormControl<EmployeeFormRawValue['startedOn']>;
  terminatedOn: FormControl<EmployeeFormRawValue['terminatedOn']>;
  empType: FormControl<EmployeeFormRawValue['empType']>;
  basePayment: FormControl<EmployeeFormRawValue['basePayment']>;
  netPayment: FormControl<EmployeeFormRawValue['netPayment']>;
  grossPayment: FormControl<EmployeeFormRawValue['grossPayment']>;
  paymentPeriod: FormControl<EmployeeFormRawValue['paymentPeriod']>;
  division: FormControl<EmployeeFormRawValue['division']>;
  person: FormControl<EmployeeFormRawValue['person']>;
};

export type EmployeeFormGroup = FormGroup<EmployeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmployeeFormService {
  createEmployeeFormGroup(employee: EmployeeFormGroupInput = { id: null }): EmployeeFormGroup {
    const employeeRawValue = this.convertEmployeeToEmployeeRawValue({
      ...this.getFormDefaults(),
      ...employee,
    });
    return new FormGroup<EmployeeFormGroupContent>({
      id: new FormControl(
        { value: employeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      empNumber: new FormControl(employeeRawValue.empNumber, {
        validators: [Validators.required],
      }),
      description: new FormControl(employeeRawValue.description),
      phoneNumber: new FormControl(employeeRawValue.phoneNumber),
      email: new FormControl(employeeRawValue.email),
      status: new FormControl(employeeRawValue.status, {
        validators: [Validators.required],
      }),
      startedOn: new FormControl(employeeRawValue.startedOn),
      terminatedOn: new FormControl(employeeRawValue.terminatedOn),
      empType: new FormControl(employeeRawValue.empType, {
        validators: [Validators.required],
      }),
      basePayment: new FormControl(employeeRawValue.basePayment),
      netPayment: new FormControl(employeeRawValue.netPayment),
      grossPayment: new FormControl(employeeRawValue.grossPayment),
      paymentPeriod: new FormControl(employeeRawValue.paymentPeriod, {
        validators: [Validators.required],
      }),
      division: new FormControl(employeeRawValue.division),
      person: new FormControl(employeeRawValue.person),
    });
  }

  getEmployee(form: EmployeeFormGroup): IEmployee | NewEmployee {
    return this.convertEmployeeRawValueToEmployee(form.getRawValue() as EmployeeFormRawValue | NewEmployeeFormRawValue);
  }

  resetForm(form: EmployeeFormGroup, employee: EmployeeFormGroupInput): void {
    const employeeRawValue = this.convertEmployeeToEmployeeRawValue({ ...this.getFormDefaults(), ...employee });
    form.reset(
      {
        ...employeeRawValue,
        id: { value: employeeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmployeeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startedOn: currentTime,
      terminatedOn: currentTime,
    };
  }

  private convertEmployeeRawValueToEmployee(rawEmployee: EmployeeFormRawValue | NewEmployeeFormRawValue): IEmployee | NewEmployee {
    return {
      ...rawEmployee,
      startedOn: dayjs(rawEmployee.startedOn, DATE_TIME_FORMAT),
      terminatedOn: dayjs(rawEmployee.terminatedOn, DATE_TIME_FORMAT),
    };
  }

  private convertEmployeeToEmployeeRawValue(
    employee: IEmployee | (Partial<NewEmployee> & EmployeeFormDefaults)
  ): EmployeeFormRawValue | PartialWithRequiredKeyOf<NewEmployeeFormRawValue> {
    return {
      ...employee,
      startedOn: employee.startedOn ? employee.startedOn.format(DATE_TIME_FORMAT) : undefined,
      terminatedOn: employee.terminatedOn ? employee.terminatedOn.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
