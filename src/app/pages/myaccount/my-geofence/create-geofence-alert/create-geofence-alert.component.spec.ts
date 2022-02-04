import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeofenceAlertComponent } from './create-geofence-alert.component';

describe('CreateGeofenceAlertComponent', () => {
  let component: CreateGeofenceAlertComponent;
  let fixture: ComponentFixture<CreateGeofenceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGeofenceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGeofenceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
