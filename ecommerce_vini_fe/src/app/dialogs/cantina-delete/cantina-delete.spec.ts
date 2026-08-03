import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantinaDelete } from './cantina-delete';

describe('CantinaDelete', () => {
  let component: CantinaDelete;
  let fixture: ComponentFixture<CantinaDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantinaDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(CantinaDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
