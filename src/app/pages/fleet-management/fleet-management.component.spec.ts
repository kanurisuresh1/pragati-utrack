import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetManagementComponent } from './fleet-management.component';

describe('FleetManagementComponent', () => {
  let component: FleetManagementComponent;
  let fixture: ComponentFixture<FleetManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
