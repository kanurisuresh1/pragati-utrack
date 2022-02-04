import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExecutiveComponent } from './my-executive.component';

describe('MyExecutiveComponent', () => {
  let component: MyExecutiveComponent;
  let fixture: ComponentFixture<MyExecutiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExecutiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
