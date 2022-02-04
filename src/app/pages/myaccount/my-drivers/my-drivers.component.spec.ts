import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDriversComponent } from './my-drivers.component';

describe('MyDriversComponent', () => {
  let component: MyDriversComponent;
  let fixture: ComponentFixture<MyDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
