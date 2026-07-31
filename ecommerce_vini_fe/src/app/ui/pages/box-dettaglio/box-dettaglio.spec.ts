import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDettaglio } from './box-dettaglio';

describe('BoxDettaglio', () => {
  let component: BoxDettaglio;
  let fixture: ComponentFixture<BoxDettaglio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxDettaglio],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxDettaglio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
