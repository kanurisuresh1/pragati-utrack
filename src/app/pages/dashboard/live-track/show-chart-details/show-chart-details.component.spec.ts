import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChartDetailsComponent } from './show-chart-details.component';

describe('ShowChartDetailsComponent', () => {
  let component: ShowChartDetailsComponent;
  let fixture: ComponentFixture<ShowChartDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChartDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
