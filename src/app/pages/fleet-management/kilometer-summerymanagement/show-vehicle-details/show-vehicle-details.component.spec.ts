import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVehicleDetailsComponent } from './show-vehicle-details.component';

describe('ShowVehicleDetailsComponent', () => {
  let component: ShowVehicleDetailsComponent;
  let fixture: ComponentFixture<ShowVehicleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowVehicleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
