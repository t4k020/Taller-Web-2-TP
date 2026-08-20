import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';

import { ContraofertaProveedorDialog } from './contraoferta-proveedor-dialog';

describe('ContraofertaProveedorDialog', () => {
  let component: ContraofertaProveedorDialog;
  let fixture: ComponentFixture<ContraofertaProveedorDialog>;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraofertaProveedorDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ContraofertaProveedorDialog);
    fixture.componentRef.setInput('form', fb.group({
      nuevaCantidad: [null, Validators.required],
      nuevoPrecio: [null],
    }));
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
