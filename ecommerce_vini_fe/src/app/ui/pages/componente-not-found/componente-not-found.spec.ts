import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteNotFound } from './componente-not-found';

describe('ComponenteNotFound', () => {
  let component: ComponenteNotFound;
  let fixture: ComponentFixture<ComponenteNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteNotFound],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteNotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
