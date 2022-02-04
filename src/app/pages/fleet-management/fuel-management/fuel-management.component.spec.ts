import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelManagementComponent } from './fuel-management.component';

describe('FuelManagementComponent', () => {
  let component: FuelManagementComponent;
  let fixture: ComponentFixture<FuelManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
