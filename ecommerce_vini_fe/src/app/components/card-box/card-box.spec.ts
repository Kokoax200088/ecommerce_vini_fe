import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBox } from './card-box';

describe('CardBox', () => {
  let component: CardBox;
  let fixture: ComponentFixture<CardBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBox],
    }).compileComponents();

    fixture = TestBed.createComponent(CardBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
