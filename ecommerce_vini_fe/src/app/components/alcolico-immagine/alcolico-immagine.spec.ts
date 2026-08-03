import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcolicoImmagine } from './alcolico-immagine';

describe('AlcolicoImmagine', () => {
  let component: AlcolicoImmagine;
  let fixture: ComponentFixture<AlcolicoImmagine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcolicoImmagine],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcolicoImmagine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
