import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustazioneNuova } from './degustazione-nuova';

describe('DegustazioneNuova', () => {
  let component: DegustazioneNuova;
  let fixture: ComponentFixture<DegustazioneNuova>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegustazioneNuova],
    }).compileComponents();

    fixture = TestBed.createComponent(DegustazioneNuova);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
