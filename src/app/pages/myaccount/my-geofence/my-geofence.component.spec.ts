import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGeofenceComponent } from './my-geofence.component';

describe('MyGeofenceComponent', () => {
  let component: MyGeofenceComponent;
  let fixture: ComponentFixture<MyGeofenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGeofenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGeofenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
