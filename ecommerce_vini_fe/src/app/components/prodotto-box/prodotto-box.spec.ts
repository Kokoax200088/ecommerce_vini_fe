import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottoBox } from './prodotto-box';

describe('ProdottoBox', () => {
  let component: ProdottoBox;
  let fixture: ComponentFixture<ProdottoBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottoBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdottoBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
