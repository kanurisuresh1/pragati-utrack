import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRouteComponent } from './my-route.component';

describe('MyRouteComponent', () => {
  let component: MyRouteComponent;
  let fixture: ComponentFixture<MyRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
