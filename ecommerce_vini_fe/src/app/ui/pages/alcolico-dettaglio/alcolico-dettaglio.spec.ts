import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoDettaglio } from './alcolico-dettaglio';

describe('AlcolicoDettaglio', () => {
  let component: AlcolicoDettaglio;
  let fixture: ComponentFixture<AlcolicoDettaglio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoDettaglio],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoDettaglio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
