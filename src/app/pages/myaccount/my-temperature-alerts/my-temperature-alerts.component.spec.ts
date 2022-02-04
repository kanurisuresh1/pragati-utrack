import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTemperatureAlertsComponent } from './my-temperature-alerts.component';

describe('MyTemperatureAlertsComponent', () => {
  let component: MyTemperatureAlertsComponent;
  let fixture: ComponentFixture<MyTemperatureAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTemperatureAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTemperatureAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
