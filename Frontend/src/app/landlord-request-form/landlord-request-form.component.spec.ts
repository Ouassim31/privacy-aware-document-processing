import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordRequestFormComponent } from './landlord-request-form.component';

describe('LandlordRequestFormComponent', () => {
  let component: LandlordRequestFormComponent;
  let fixture: ComponentFixture<LandlordRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandlordRequestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
