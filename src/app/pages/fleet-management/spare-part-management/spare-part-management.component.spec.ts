import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartManagementComponent } from './spare-part-management.component';

describe('SparePartManagementComponent', () => {
  let component: SparePartManagementComponent;
  let fixture: ComponentFixture<SparePartManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
