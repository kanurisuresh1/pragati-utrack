import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreManagementComponent } from './tyre-management.component';

describe('TyreManagementComponent', () => {
  let component: TyreManagementComponent;
  let fixture: ComponentFixture<TyreManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
