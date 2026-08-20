import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroEstanteria } from './libro-estanteria';

describe('LibroEstanteria', () => {
  let component: LibroEstanteria;
  let fixture: ComponentFixture<LibroEstanteria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroEstanteria],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroEstanteria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
