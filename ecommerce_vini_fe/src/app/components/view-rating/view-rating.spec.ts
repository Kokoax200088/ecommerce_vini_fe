import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRating } from './view-rating';

describe('ViewRating', () => {
  let component: ViewRating;
  let fixture: ComponentFixture<ViewRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRating],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
