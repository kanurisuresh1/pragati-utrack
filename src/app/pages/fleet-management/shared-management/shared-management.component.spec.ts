import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedManagementComponent } from './shared-management.component';

describe('SharedManagementComponent', () => {
  let component: SharedManagementComponent;
  let fixture: ComponentFixture<SharedManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
