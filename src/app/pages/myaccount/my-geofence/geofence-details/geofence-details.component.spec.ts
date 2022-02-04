import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceDetailsComponent } from './geofence-details.component';

describe('GeofenceDetailsComponent', () => {
  let component: GeofenceDetailsComponent;
  let fixture: ComponentFixture<GeofenceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofenceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
