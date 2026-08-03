import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAddBox } from './card-add-box';

describe('CardAddBox', () => {
  let component: CardAddBox;
  let fixture: ComponentFixture<CardAddBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAddBox],
    }).compileComponents();

    fixture = TestBed.createComponent(CardAddBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
