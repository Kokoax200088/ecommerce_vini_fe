import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBox } from './add-box';

describe('AddBox', () => {
  let component: AddBox;
  let fixture: ComponentFixture<AddBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBox],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
