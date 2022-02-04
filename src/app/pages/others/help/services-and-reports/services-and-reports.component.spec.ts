import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAndReportsComponent } from './services-and-reports.component';

describe('ServicesAndReportsComponent', () => {
  let component: ServicesAndReportsComponent;
  let fixture: ComponentFixture<ServicesAndReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesAndReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesAndReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
