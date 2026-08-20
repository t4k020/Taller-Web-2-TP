import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estanteria } from './estanteria';

describe('Estanteria', () => {
  let component: Estanteria;
  let fixture: ComponentFixture<Estanteria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estanteria],
    }).compileComponents();

    fixture = TestBed.createComponent(Estanteria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
