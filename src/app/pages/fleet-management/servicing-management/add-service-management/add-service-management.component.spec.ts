import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceManagementComponent } from './add-service-management.component';

describe('AddServiceManagementComponent', () => {
  let component: AddServiceManagementComponent;
  let fixture: ComponentFixture<AddServiceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
