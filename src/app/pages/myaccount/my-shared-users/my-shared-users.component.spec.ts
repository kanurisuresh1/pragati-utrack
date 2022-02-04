import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySharedUsersComponent } from './my-shared-users.component';

describe('MySharedUsersComponent', () => {
  let component: MySharedUsersComponent;
  let fixture: ComponentFixture<MySharedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySharedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySharedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
