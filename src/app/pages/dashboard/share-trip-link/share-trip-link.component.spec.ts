import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTripLinkComponent } from './share-trip-link.component';

describe('ShareTripLinkComponent', () => {
  let component: ShareTripLinkComponent;
  let fixture: ComponentFixture<ShareTripLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTripLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTripLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
