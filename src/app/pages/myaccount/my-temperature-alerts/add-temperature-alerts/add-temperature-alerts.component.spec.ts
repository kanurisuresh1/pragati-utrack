import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemperatureAlertsComponent } from './add-temperature-alerts.component';

describe('AddTemperatureAlertsComponent', () => {
  let component: AddTemperatureAlertsComponent;
  let fixture: ComponentFixture<AddTemperatureAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTemperatureAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemperatureAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
