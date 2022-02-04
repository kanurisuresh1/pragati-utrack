import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelManagementComponent } from './add-fuel-management.component';

describe('AddFuelManagementComponent', () => {
  let component: AddFuelManagementComponent;
  let fixture: ComponentFixture<AddFuelManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
