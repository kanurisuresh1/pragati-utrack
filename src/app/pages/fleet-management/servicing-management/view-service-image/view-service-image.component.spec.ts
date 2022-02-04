import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceImageComponent } from './view-service-image.component';

describe('ViewServiceImageComponent', () => {
  let component: ViewServiceImageComponent;
  let fixture: ComponentFixture<ViewServiceImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServiceImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServiceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
