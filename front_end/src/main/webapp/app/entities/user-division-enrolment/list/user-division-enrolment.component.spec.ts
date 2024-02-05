import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserDivisionEnrolmentService } from '../service/user-division-enrolment.service';

import { UserDivisionEnrolmentComponent } from './user-division-enrolment.component';

describe('UserDivisionEnrolment Management Component', () => {
  let comp: UserDivisionEnrolmentComponent;
  let fixture: ComponentFixture<UserDivisionEnrolmentComponent>;
  let service: UserDivisionEnrolmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user-division-enrolment', component: UserDivisionEnrolmentComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [UserDivisionEnrolmentComponent],
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
      .overrideTemplate(UserDivisionEnrolmentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDivisionEnrolmentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserDivisionEnrolmentService);

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
    expect(comp.userDivisionEnrolments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userDivisionEnrolmentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserDivisionEnrolmentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserDivisionEnrolmentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
