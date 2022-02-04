import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTagInformationComponent } from './fast-tag-information.component';

describe('FastTagInformationComponent', () => {
  let component: FastTagInformationComponent;
  let fixture: ComponentFixture<FastTagInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastTagInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastTagInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
