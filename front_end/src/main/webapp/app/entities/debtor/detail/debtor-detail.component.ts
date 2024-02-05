import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDebtor } from '../debtor.model';

@Component({
  selector: 'jhi-debtor-detail',
  templateUrl: './debtor-detail.component.html',
})
export class DebtorDetailComponent implements OnInit {
  debtor: IDebtor | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ debtor }) => {
      this.debtor = debtor;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
