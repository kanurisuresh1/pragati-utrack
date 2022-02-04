import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusNotificationsComponent } from './bus-notifications.component';

describe('BusNotificationsComponent', () => {
  let component: BusNotificationsComponent;
  let fixture: ComponentFixture<BusNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
