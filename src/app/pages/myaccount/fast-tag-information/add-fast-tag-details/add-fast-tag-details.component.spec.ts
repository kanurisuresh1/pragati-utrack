import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFastTagDetailsComponent } from './add-fast-tag-details.component';

describe('AddFastTagDetailsComponent', () => {
  let component: AddFastTagDetailsComponent;
  let fixture: ComponentFixture<AddFastTagDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFastTagDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFastTagDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
