import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAlcolici } from './lista-alcolici';

describe('ListaAlcolici', () => {
  let component: ListaAlcolici;
  let fixture: ComponentFixture<ListaAlcolici>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAlcolici],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAlcolici);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
