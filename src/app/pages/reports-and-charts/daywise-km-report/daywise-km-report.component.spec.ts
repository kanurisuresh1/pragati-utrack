import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseKmReportComponent } from './daywise-km-report.component';

describe('DaywiseKmReportComponent', () => {
  let component: DaywiseKmReportComponent;
  let fixture: ComponentFixture<DaywiseKmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaywiseKmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseKmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
