import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSharedUserComponent } from './add-shared-user.component';

describe('AddSharedUserComponent', () => {
  let component: AddSharedUserComponent;
  let fixture: ComponentFixture<AddSharedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSharedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSharedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
