import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustazioneEliminaConferma } from './degustazione-elimina-conferma';

describe('DegustazioneEliminaConferma', () => {
  let component: DegustazioneEliminaConferma;
  let fixture: ComponentFixture<DegustazioneEliminaConferma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegustazioneEliminaConferma],
    }).compileComponents();

    fixture = TestBed.createComponent(DegustazioneEliminaConferma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
