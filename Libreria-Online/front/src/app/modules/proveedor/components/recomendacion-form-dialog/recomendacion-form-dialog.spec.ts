import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';

import { RecomendacionFormDialog } from './recomendacion-form-dialog';

describe('RecomendacionFormDialog', () => {
  let component: RecomendacionFormDialog;
  let fixture: ComponentFixture<RecomendacionFormDialog>;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RecomendacionFormDialog);
    fixture.componentRef.setInput('form', fb.group({
      isbn: ['', Validators.required],
      nombre: ['', Validators.required],
      autor: ['', Validators.required],
      categoria: [null, Validators.required],
      sinopsis: [''],
      imagenUrl: [''],
      precioProveedor: [null, Validators.required],
      cantidadProveedor: [null, Validators.required],
      libroId: [null],
    }));
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
