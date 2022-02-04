import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackReportComponent } from './track-report.component';

describe('TrackReportComponent', () => {
  let component: TrackReportComponent;
  let fixture: ComponentFixture<TrackReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
