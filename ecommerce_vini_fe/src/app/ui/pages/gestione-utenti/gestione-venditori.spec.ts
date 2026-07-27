import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneVenditori } from './gestione-venditori';

describe('GestioneVenditori', () => {
  let component: GestioneVenditori;
  let fixture: ComponentFixture<GestioneVenditori>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneVenditori],
    }).compileComponents();

    fixture = TestBed.createComponent(GestioneVenditori);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
