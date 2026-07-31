import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoElimina } from './alcolico-elimina';

describe('AlcolicoElimina', () => {
  let component: AlcolicoElimina;
  let fixture: ComponentFixture<AlcolicoElimina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoElimina],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoElimina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
