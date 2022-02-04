import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Twenty4HoursKmReportComponent } from './twenty4-hours-km-report.component';

describe('Twenty4HoursKmReportComponent', () => {
  let component: Twenty4HoursKmReportComponent;
  let fixture: ComponentFixture<Twenty4HoursKmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Twenty4HoursKmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Twenty4HoursKmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
