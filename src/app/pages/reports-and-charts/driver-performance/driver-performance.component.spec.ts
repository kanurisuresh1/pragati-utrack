import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPerformanceComponent } from './driver-performance.component';

describe('DriverPerformanceComponent', () => {
  let component: DriverPerformanceComponent;
  let fixture: ComponentFixture<DriverPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
