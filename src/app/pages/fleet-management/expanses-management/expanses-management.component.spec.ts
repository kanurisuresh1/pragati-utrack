import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansesManagementComponent } from './expanses-management.component';

describe('ExpansesManagementComponent', () => {
  let component: ExpansesManagementComponent;
  let fixture: ComponentFixture<ExpansesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
