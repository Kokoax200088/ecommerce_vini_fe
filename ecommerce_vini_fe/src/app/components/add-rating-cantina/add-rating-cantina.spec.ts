import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRatingCantina } from './add-rating-cantina';

describe('AddRatingCantina', () => {
  let component: AddRatingCantina;
  let fixture: ComponentFixture<AddRatingCantina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRatingCantina],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRatingCantina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
