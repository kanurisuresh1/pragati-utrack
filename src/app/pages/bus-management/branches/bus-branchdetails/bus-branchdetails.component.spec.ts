import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBranchdetailsComponent } from './bus-branchdetails.component';

describe('BusBranchdetailsComponent', () => {
  let component: BusBranchdetailsComponent;
  let fixture: ComponentFixture<BusBranchdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusBranchdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusBranchdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
