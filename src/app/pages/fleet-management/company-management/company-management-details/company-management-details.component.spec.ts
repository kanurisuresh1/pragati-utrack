import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyManagementDetailsComponent } from './company-management-details.component';

describe('CompanyManagementDetailsComponent', () => {
  let component: CompanyManagementDetailsComponent;
  let fixture: ComponentFixture<CompanyManagementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyManagementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyManagementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
