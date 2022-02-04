import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureDashboardComponent } from './temperature-dashboard.component';

describe('TemperatureDashboardComponent', () => {
  let component: TemperatureDashboardComponent;
  let fixture: ComponentFixture<TemperatureDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
