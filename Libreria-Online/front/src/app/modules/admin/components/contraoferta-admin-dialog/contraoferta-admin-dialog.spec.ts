import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';

import { ContraofertaAdminDialog } from './contraoferta-admin-dialog';

describe('ContraofertaAdminDialog', () => {
  let component: ContraofertaAdminDialog;
  let fixture: ComponentFixture<ContraofertaAdminDialog>;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraofertaAdminDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ContraofertaAdminDialog);
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
