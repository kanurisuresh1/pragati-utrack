import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollPlazaTransactionsComponent } from './toll-plaza-transactions.component';

describe('TollPlazaTransactionsComponent', () => {
  let component: TollPlazaTransactionsComponent;
  let fixture: ComponentFixture<TollPlazaTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollPlazaTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollPlazaTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
