import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AttachmentDetailComponent } from './attachment-detail.component';

describe('Attachment Management Detail Component', () => {
  let comp: AttachmentDetailComponent;
  let fixture: ComponentFixture<AttachmentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ attachment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AttachmentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AttachmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load attachment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.attachment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
