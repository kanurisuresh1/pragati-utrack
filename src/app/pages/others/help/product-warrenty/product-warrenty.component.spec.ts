import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarrentyComponent } from './product-warrenty.component';

describe('ProductWarrentyComponent', () => {
  let component: ProductWarrentyComponent;
  let fixture: ComponentFixture<ProductWarrentyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWarrentyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWarrentyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
