import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelReportsComponent } from './fuel-reports.component';

describe('FuelReportsComponent', () => {
  let component: FuelReportsComponent;
  let fixture: ComponentFixture<FuelReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
