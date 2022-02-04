import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KilometerCustomermanagementComponent } from './kilometer-customermanagement.component';

describe('KilometerCustomermanagementComponent', () => {
  let component: KilometerCustomermanagementComponent;
  let fixture: ComponentFixture<KilometerCustomermanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KilometerCustomermanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KilometerCustomermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
