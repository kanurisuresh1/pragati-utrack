import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerManagementComponent } from './add-customer-management.component';

describe('AddCustomerManagementComponent', () => {
  let component: AddCustomerManagementComponent;
  let fixture: ComponentFixture<AddCustomerManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
