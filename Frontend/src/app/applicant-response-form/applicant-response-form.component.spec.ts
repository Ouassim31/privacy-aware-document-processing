import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantResponseFormComponent } from './applicant-response-form.component';

describe('ApplicantResponseFormComponent', () => {
  let component: ApplicantResponseFormComponent;
  let fixture: ComponentFixture<ApplicantResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantResponseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
