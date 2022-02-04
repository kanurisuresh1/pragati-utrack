import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNumberDetailsComponent } from './vehicle-number-details.component';

describe('VehicleNumberDetailsComponent', () => {
  let component: VehicleNumberDetailsComponent;
  let fixture: ComponentFixture<VehicleNumberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNumberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNumberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
