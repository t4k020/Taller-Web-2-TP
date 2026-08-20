import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { LibrosService } from '../../../../api/services/libros/libros.services';
import { CATEGORIAS_LIBRO, Libro } from '../../../../shared/interfaces/libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-actualizar-libro',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    InputText,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './actualizar-libro.html',
  styleUrl: './actualizar-libro.css',
})
export class ActualizarLibro {
  visible = false;
  isLoading = false;
  libroSeleccionado: Libro | null = null;
  categorias = CATEGORIAS_LIBRO;
  sinopsisMaxLength = 700;

  @Output() libroActualizado = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);

  bookForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['GENERAL', [Validators.required]],
    sinopsis: ['', [Validators.maxLength(this.sinopsisMaxLength)]],
    precio: [null, [Validators.required, Validators.min(0)]],
  });

  showDialog(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.bookForm.patchValue({
      nombre: libro.nombre,
      isbn: libro.isbn,
      autor: libro.autor,
      categoria: libro.categoria,
      sinopsis: libro.sinopsis ?? '',
      precio: libro.precio,
    });
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.libroSeleccionado = null;
    this.bookForm.reset({ categoria: 'GENERAL' });
  }

  guardarLibro(): void {
    if (this.bookForm.invalid || !this.libroSeleccionado) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const libro = this.bookForm.getRawValue();

    this.librosService.updateLibro(this.libroSeleccionado.id, {
      nombre: String(libro.nombre ?? ''),
      isbn: String(libro.isbn ?? ''),
      autor: String(libro.autor ?? ''),
      categoria: libro.categoria ?? 'GENERAL',
      sinopsis: String(libro.sinopsis ?? ''),
      precio: Number(libro.precio ?? 0),
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDialog();
        this.toastService.updated('Libro');
        this.libroActualizado.emit();
      },
      error: (error) => {
        console.error('Error al actualizar el libro', error);
        this.isLoading = false;
        this.toastService.error('No se pudo actualizar el libro.');
      }
    });
  }

  get nombre() { return this.bookForm.get('nombre'); }
  get isbn() { return this.bookForm.get('isbn'); }
  get autor() { return this.bookForm.get('autor'); }
  get categoria() { return this.bookForm.get('categoria'); }
  get sinopsis() { return this.bookForm.get('sinopsis'); }
  get precio() { return this.bookForm.get('precio'); }
}
