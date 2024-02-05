import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationLevelDetailComponent } from './location-level-detail.component';

describe('LocationLevel Management Detail Component', () => {
  let comp: LocationLevelDetailComponent;
  let fixture: ComponentFixture<LocationLevelDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationLevelDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ locationLevel: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LocationLevelDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LocationLevelDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load locationLevel on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.locationLevel).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
