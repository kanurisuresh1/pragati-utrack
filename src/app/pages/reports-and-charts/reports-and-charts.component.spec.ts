import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAndChartsComponent } from './reports-and-charts.component';

describe('ReportsAndChartsComponent', () => {
  let component: ReportsAndChartsComponent;
  let fixture: ComponentFixture<ReportsAndChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsAndChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAndChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
