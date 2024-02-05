import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserDivisionEnrolment } from '../user-division-enrolment.model';

@Component({
  selector: 'jhi-user-division-enrolment-detail',
  templateUrl: './user-division-enrolment-detail.component.html',
})
export class UserDivisionEnrolmentDetailComponent implements OnInit {
  userDivisionEnrolment: IUserDivisionEnrolment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDivisionEnrolment }) => {
      this.userDivisionEnrolment = userDivisionEnrolment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
