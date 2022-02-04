import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullVechicleDetailsComponent } from './full-vechicle-details.component';

describe('FullVechicleDetailsComponent', () => {
  let component: FullVechicleDetailsComponent;
  let fixture: ComponentFixture<FullVechicleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullVechicleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullVechicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
