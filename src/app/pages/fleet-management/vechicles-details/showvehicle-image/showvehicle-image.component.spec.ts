import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowvehicleImageComponent } from './showvehicle-image.component';

describe('ShowvehicleImageComponent', () => {
  let component: ShowvehicleImageComponent;
  let fixture: ComponentFixture<ShowvehicleImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowvehicleImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowvehicleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
