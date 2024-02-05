import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AttachmentService } from '../service/attachment.service';

import { AttachmentComponent } from './attachment.component';

describe('Attachment Management Component', () => {
  let comp: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'attachment', component: AttachmentComponent }]), HttpClientTestingModule],
      declarations: [AttachmentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AttachmentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttachmentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AttachmentService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.attachments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to attachmentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAttachmentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAttachmentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
