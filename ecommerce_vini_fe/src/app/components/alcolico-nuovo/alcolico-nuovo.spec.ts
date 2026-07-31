import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoNuovo } from './alcolico-nuovo';

describe('AlcolicoNuovo', () => {
  let component: AlcolicoNuovo;
  let fixture: ComponentFixture<AlcolicoNuovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoNuovo],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoNuovo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
