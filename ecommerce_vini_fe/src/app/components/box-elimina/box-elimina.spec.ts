import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxElimina } from './box-elimina';

describe('BoxElimina', () => {
  let component: BoxElimina;
  let fixture: ComponentFixture<BoxElimina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxElimina],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxElimina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
