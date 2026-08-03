import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantinaCreate } from './cantina-create';

describe('CantinaCreate', () => {
  let component: CantinaCreate;
  let fixture: ComponentFixture<CantinaCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantinaCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CantinaCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
