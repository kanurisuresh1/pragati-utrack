import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySummaryKmReportComponent } from './daily-summary-km-report.component';

describe('DailySummaryKmReportComponent', () => {
  let component: DailySummaryKmReportComponent;
  let fixture: ComponentFixture<DailySummaryKmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailySummaryKmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySummaryKmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
