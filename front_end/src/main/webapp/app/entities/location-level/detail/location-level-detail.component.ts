import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationLevel } from '../location-level.model';

@Component({
  selector: 'jhi-location-level-detail',
  templateUrl: './location-level-detail.component.html',
})
export class LocationLevelDetailComponent implements OnInit {
  locationLevel: ILocationLevel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationLevel }) => {
      this.locationLevel = locationLevel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
