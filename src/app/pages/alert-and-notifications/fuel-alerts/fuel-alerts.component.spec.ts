import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAlertsComponent } from './fuel-alerts.component';

describe('FuelAlertsComponent', () => {
  let component: FuelAlertsComponent;
  let fixture: ComponentFixture<FuelAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
