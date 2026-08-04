import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustazioneImmagine } from './degustazione-immagine';

describe('DegustazioneImmagine', () => {
  let component: DegustazioneImmagine;
  let fixture: ComponentFixture<DegustazioneImmagine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegustazioneImmagine],
    }).compileComponents();

    fixture = TestBed.createComponent(DegustazioneImmagine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
