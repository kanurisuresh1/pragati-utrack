import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollChargesDialogComponent } from './toll-charges-dialog.component';

describe('TollChargesDialogComponent', () => {
  let component: TollChargesDialogComponent;
  let fixture: ComponentFixture<TollChargesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollChargesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollChargesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
