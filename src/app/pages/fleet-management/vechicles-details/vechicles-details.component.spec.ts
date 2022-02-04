import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VechiclesDetailsComponent } from './vechicles-details.component';

describe('VechiclesDetailsComponent', () => {
  let component: VechiclesDetailsComponent;
  let fixture: ComponentFixture<VechiclesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VechiclesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VechiclesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
