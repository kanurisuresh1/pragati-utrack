import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDetailsComponent } from './open-details.component';

describe('OpenDetailsComponent', () => {
  let component: OpenDetailsComponent;
  let fixture: ComponentFixture<OpenDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
