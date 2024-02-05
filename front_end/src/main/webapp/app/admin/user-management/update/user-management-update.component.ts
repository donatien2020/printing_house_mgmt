import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LANGUAGES } from 'app/config/language.constants';
import { MARITAL_STATUSES } from 'app/config/marital_status.constants';
import { GENDERS } from 'app/config/genders.constants';

import { IUser } from '../user-management.model';
import { IPOrganization } from '../../../entities/p-organization/p-organization.model';
import { POrganizationService } from '../../../entities/p-organization/service/p-organization.service';

import { UserManagementService } from '../service/user-management.service';
import { finalize, map } from 'rxjs/operators';

const userTemplate = {} as IUser;

const newUser: IUser = {
  langKey: 'en',
  activated: true,
  gender:'MALE',
  maritalStatus:'SINGLE'
} as IUser;

@Component({
  selector: 'jhi-user-mgmt-update',
  templateUrl: './user-management-update.component.html',
})
export class UserManagementUpdateComponent implements OnInit {
  languages = LANGUAGES;
  maritalStatuses=MARITAL_STATUSES;
  genders=GENDERS;
  organizations=[1,100,300,5,8];
  authorities: string[] = [];
  isSaving = false;
  organizationsSharedCollection: IPOrganization[] = [];
  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    login: new FormControl(userTemplate.login, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    nid: new FormControl(userTemplate.nid, {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(16)
          ],
        }),
    firstName: new FormControl(userTemplate.firstName, { validators: [Validators.maxLength(50)] }),
    lastName: new FormControl(userTemplate.lastName, { validators: [Validators.maxLength(50)] }),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    phone: new FormControl(userTemplate.phone, {
          nonNullable: true,
          validators: [Validators.minLength(8), Validators.maxLength(13)],
        }),
    activated: new FormControl(userTemplate.activated, { nonNullable: true }),
    langKey: new FormControl(userTemplate.langKey, { nonNullable: true }),
    authorities: new FormControl(userTemplate.authorities, { nonNullable: true }),
    maritalStatus: new FormControl(userTemplate.maritalStatus, { nonNullable: true }),
    gender: new FormControl(userTemplate.gender, { nonNullable: true }),
    organizationId: new FormControl(userTemplate.organizationId, { nonNullable: true }),
  });

  constructor(
   private userService: UserManagementService,
   private route: ActivatedRoute,
   protected organizationService: POrganizationService

   ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.editForm.reset(user);
      } else {
        this.editForm.reset(newUser);
      }
    });

     this.loadRelationshipsOptions();

    this.userService.authorities().subscribe(authorities => (this.authorities = authorities));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
    if (user.id !== null) {
      this.userService.update(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    } else {
      this.userService.create(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }

    protected loadRelationshipsOptions(): void {
      this.organizationService
        .query()
        .pipe(map((res: HttpResponse<IPOrganization[]>) => res.body ?? []))
        .pipe(
          map((organizations: IPOrganization[]) => this.organizationService.addPOrganizationToCollectionIfMissing<IPOrganization>(organizations))
        )
        .subscribe((organizations: IPOrganization[]) => (this.organizationsSharedCollection = organizations));
    }

}
