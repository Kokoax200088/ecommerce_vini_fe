import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBox } from './delete-box';

describe('DeleteBox', () => {
  let component: DeleteBox;
  let fixture: ComponentFixture<DeleteBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBox],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
