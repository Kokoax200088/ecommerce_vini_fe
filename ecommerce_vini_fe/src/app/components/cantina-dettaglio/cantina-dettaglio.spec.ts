import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantinaDettaglio } from './cantina-dettaglio';

describe('CantinaDettaglio', () => {
  let component: CantinaDettaglio;
  let fixture: ComponentFixture<CantinaDettaglio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantinaDettaglio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantinaDettaglio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
