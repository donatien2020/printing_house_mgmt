import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPOrganization } from '../p-organization.model';

@Component({
  selector: 'jhi-p-organization-detail',
  templateUrl: './p-organization-detail.component.html',
})
export class POrganizationDetailComponent implements OnInit {
  pOrganization: IPOrganization | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pOrganization }) => {
      this.pOrganization = pOrganization;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
