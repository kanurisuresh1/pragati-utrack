import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactDetailsComponent } from './emergency-contact-details.component';

describe('EmergencyContactDetailsComponent', () => {
  let component: EmergencyContactDetailsComponent;
  let fixture: ComponentFixture<EmergencyContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
