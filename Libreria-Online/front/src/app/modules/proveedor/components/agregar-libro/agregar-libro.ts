import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { LibrosService } from '../../../../api/services/libros/libros.services';
import { CATEGORIAS_LIBRO } from '../../../../shared/interfaces/libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-agregar-libro',
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
  templateUrl: './agregar-libro.html',
  styleUrl: './agregar-libro.css',
})
export class AgregarLibro implements OnInit {
  bookForm!: FormGroup;
  visible = false;
  isLoading = false;
  categorias = CATEGORIAS_LIBRO;
  sinopsisMaxLength = 700;

  @Output() libroCreado = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.bookForm = this.fb.group({
      // Agregamos el nombre y pasamos todo al espa\u00f1ol para que matchee con el backend
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      categoria: [null, [Validators.required]],
      sinopsis: ['', [Validators.maxLength(this.sinopsisMaxLength)]],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  guardarLibro() {
    if (this.bookForm.invalid) {
      console.error('ERROR: El formulario es inv\u00e1lido. Deteniendo ejecuci\u00f3n.');
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.bookForm.getRawValue();

    this.librosService.crearLibro(formData).subscribe({
      next: () => {
        this.closeDialog();
        this.isLoading = false;
        this.toastService.created('Libro');
        this.libroCreado.emit();
      },
      error: (error: any) => {
        console.error('3. ERROR DEL BACKEND:', error);
        this.isLoading = false;
        this.toastService.error('No se pudo crear el libro.');
      }
    });
  }

  private resetForm() {
    this.bookForm.reset({ categoria: null });
  }

  // Getters actualizados
  get nombre() { return this.bookForm.get('nombre'); }
  get isbn() { return this.bookForm.get('isbn'); }
  get autor() { return this.bookForm.get('autor'); }
  get categoria() { return this.bookForm.get('categoria'); }
  get sinopsis() { return this.bookForm.get('sinopsis'); }
  get precio() { return this.bookForm.get('precio'); }
  get stock() { return this.bookForm.get('stock'); }
}
