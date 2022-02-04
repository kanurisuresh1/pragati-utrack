import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Twenty4HoursAnalysisComponent } from './twenty4-hours-analysis.component';

describe('Twenty4HoursAnalysisComponent', () => {
  let component: Twenty4HoursAnalysisComponent;
  let fixture: ComponentFixture<Twenty4HoursAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Twenty4HoursAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Twenty4HoursAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
