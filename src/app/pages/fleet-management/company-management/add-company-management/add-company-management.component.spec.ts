import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyManagementComponent } from './add-company-management.component';

describe('AddCompanyManagementComponent', () => {
  let component: AddCompanyManagementComponent;
  let fixture: ComponentFixture<AddCompanyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
