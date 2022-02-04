import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertmanagementComponent } from './alertmanagement.component';

describe('AlertmanagementComponent', () => {
  let component: AlertmanagementComponent;
  let fixture: ComponentFixture<AlertmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
