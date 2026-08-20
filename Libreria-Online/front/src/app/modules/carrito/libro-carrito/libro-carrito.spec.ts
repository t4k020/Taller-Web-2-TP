import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroCarrito } from './libro-carrito';

describe('LibroCarrito', () => {
  let component: LibroCarrito;
  let fixture: ComponentFixture<LibroCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroCarrito],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroCarrito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
