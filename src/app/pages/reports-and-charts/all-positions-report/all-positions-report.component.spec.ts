import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPositionsReportComponent } from './all-positions-report.component';

describe('AllPositionsReportComponent', () => {
  let component: AllPositionsReportComponent;
  let fixture: ComponentFixture<AllPositionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPositionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPositionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
