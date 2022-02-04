import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAndNotificationsComponent } from './alert-and-notifications.component';

describe('AlertAndNotificationsComponent', () => {
  let component: AlertAndNotificationsComponent;
  let fixture: ComponentFixture<AlertAndNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertAndNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAndNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
