import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KilometerSummerymanagementComponent } from './kilometer-summerymanagement.component';

describe('KilometerSummerymanagementComponent', () => {
  let component: KilometerSummerymanagementComponent;
  let fixture: ComponentFixture<KilometerSummerymanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KilometerSummerymanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KilometerSummerymanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
