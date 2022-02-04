import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceReportComponent } from './distance-report.component';

describe('DistanceReportComponent', () => {
  let component: DistanceReportComponent;
  let fixture: ComponentFixture<DistanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
