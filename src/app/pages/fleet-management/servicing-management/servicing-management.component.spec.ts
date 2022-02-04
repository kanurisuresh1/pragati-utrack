import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingManagementComponent } from './servicing-management.component';

describe('ServicingManagementComponent', () => {
  let component: ServicingManagementComponent;
  let fixture: ComponentFixture<ServicingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
