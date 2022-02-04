import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripDetailsComponent } from './vehicle-trip-details.component';

describe('VehicleTripDetailsComponent', () => {
  let component: VehicleTripDetailsComponent;
  let fixture: ComponentFixture<VehicleTripDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
