import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustazioneForm } from './degustazione-form';

describe('DegustazioneForm', () => {
  let component: DegustazioneForm;
  let fixture: ComponentFixture<DegustazioneForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegustazioneForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DegustazioneForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
