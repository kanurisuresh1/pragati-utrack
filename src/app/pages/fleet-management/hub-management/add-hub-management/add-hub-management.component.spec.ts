import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHubManagementComponent } from './add-hub-management.component';

describe('AddHubManagementComponent', () => {
  let component: AddHubManagementComponent;
  let fixture: ComponentFixture<AddHubManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHubManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHubManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
