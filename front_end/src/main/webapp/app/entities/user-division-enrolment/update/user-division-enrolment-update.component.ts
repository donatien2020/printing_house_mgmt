import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserDivisionEnrolmentFormService, UserDivisionEnrolmentFormGroup } from './user-division-enrolment-form.service';
import { IUserDivisionEnrolment } from '../user-division-enrolment.model';
import { UserDivisionEnrolmentService } from '../service/user-division-enrolment.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDivision } from 'app/entities/division/division.model';
import { DivisionService } from 'app/entities/division/service/division.service';
import { EnrollmentStatus } from 'app/entities/enumerations/enrollment-status.model';

@Component({
  selector: 'jhi-user-division-enrolment-update',
  templateUrl: './user-division-enrolment-update.component.html',
})
export class UserDivisionEnrolmentUpdateComponent implements OnInit {
  isSaving = false;
  userDivisionEnrolment: IUserDivisionEnrolment | null = null;
  enrollmentStatusValues = Object.keys(EnrollmentStatus);

  pUsersSharedCollection: IUser[] = [];
  divisionsSharedCollection: IDivision[] = [];

  editForm: UserDivisionEnrolmentFormGroup = this.userDivisionEnrolmentFormService.createUserDivisionEnrolmentFormGroup();

  constructor(
    protected userDivisionEnrolmentService: UserDivisionEnrolmentService,
    protected userDivisionEnrolmentFormService: UserDivisionEnrolmentFormService,
    protected userService: UserService,
    protected divisionService: DivisionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareDivision = (o1: IDivision | null, o2: IDivision | null): boolean => this.divisionService.compareDivision(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDivisionEnrolment }) => {
      this.userDivisionEnrolment = userDivisionEnrolment;
      if (userDivisionEnrolment) {
        this.updateForm(userDivisionEnrolment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDivisionEnrolment = this.userDivisionEnrolmentFormService.getUserDivisionEnrolment(this.editForm);
    if (userDivisionEnrolment.id !== null) {
      this.subscribeToSaveResponse(this.userDivisionEnrolmentService.update(userDivisionEnrolment));
    } else {
      this.subscribeToSaveResponse(this.userDivisionEnrolmentService.create(userDivisionEnrolment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDivisionEnrolment>>): void {
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

  protected updateForm(userDivisionEnrolment: IUserDivisionEnrolment): void {
    this.userDivisionEnrolment = userDivisionEnrolment;
    this.userDivisionEnrolmentFormService.resetForm(this.editForm, userDivisionEnrolment);

    this.pUsersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.pUsersSharedCollection,
      userDivisionEnrolment.user
    );
    this.divisionsSharedCollection = this.divisionService.addDivisionToCollectionIfMissing<IDivision>(
      this.divisionsSharedCollection,
      userDivisionEnrolment.division
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((pUsers: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(pUsers, this.userDivisionEnrolment?.user)))
      .subscribe((pUsers: IUser[]) => (this.pUsersSharedCollection = pUsers));

    this.divisionService
      .query()
      .pipe(map((res: HttpResponse<IDivision[]>) => res.body ?? []))
      .pipe(
        map((divisions: IDivision[]) =>
          this.divisionService.addDivisionToCollectionIfMissing<IDivision>(divisions, this.userDivisionEnrolment?.division)
        )
      )
      .subscribe((divisions: IDivision[]) => (this.divisionsSharedCollection = divisions));
  }
}
