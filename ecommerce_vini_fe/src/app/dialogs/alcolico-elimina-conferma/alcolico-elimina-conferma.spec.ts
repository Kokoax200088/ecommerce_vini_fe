import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoEliminaConferma } from './alcolico-elimina-conferma';

describe('AlcolicoEliminaConferma', () => {
  let component: AlcolicoEliminaConferma;
  let fixture: ComponentFixture<AlcolicoEliminaConferma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoEliminaConferma],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoEliminaConferma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
