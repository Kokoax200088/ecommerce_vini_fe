import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoNuovoForm } from './alcolico-nuovo-form';

describe('AlcolicoNuovoForm', () => {
  let component: AlcolicoNuovoForm;
  let fixture: ComponentFixture<AlcolicoNuovoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoNuovoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoNuovoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
