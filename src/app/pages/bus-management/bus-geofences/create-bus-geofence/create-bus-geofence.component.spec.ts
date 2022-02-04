import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusGeofenceComponent } from './create-bus-geofence.component';

describe('CreateBusGeofenceComponent', () => {
  let component: CreateBusGeofenceComponent;
  let fixture: ComponentFixture<CreateBusGeofenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusGeofenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusGeofenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
