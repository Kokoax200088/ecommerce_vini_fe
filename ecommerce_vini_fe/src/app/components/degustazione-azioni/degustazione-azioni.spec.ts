import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustazioneAzioni } from './degustazione-azioni';

describe('DegustazioneAzioni', () => {
  let component: DegustazioneAzioni;
  let fixture: ComponentFixture<DegustazioneAzioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegustazioneAzioni],
    }).compileComponents();

    fixture = TestBed.createComponent(DegustazioneAzioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
