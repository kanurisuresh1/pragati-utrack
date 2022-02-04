import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubManagementComponent } from './hub-management.component';

describe('HubManagementComponent', () => {
  let component: HubManagementComponent;
  let fixture: ComponentFixture<HubManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
