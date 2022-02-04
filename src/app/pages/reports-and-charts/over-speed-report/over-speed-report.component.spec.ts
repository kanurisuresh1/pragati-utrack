import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverSpeedReportComponent } from './over-speed-report.component';

describe('OverSpeedReportComponent', () => {
  let component: OverSpeedReportComponent;
  let fixture: ComponentFixture<OverSpeedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverSpeedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverSpeedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
