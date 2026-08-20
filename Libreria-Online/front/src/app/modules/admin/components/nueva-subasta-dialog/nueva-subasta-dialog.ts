import { Component, input, output, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon, InputGroupAddonModule } from "primeng/inputgroupaddon";
import { FloatLabelModule } from "primeng/floatlabel";
import { Dialog, DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  
  selector: 'app-nueva-subasta-dialog',
  imports: [
    ButtonModule,
    InputGroup,
    InputGroupAddon,
    FloatLabelModule,
    Dialog,
    FormsModule,
    InputNumberModule,
    ReactiveFormsModule,
    DialogModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,



],
  templateUrl: './nueva-subasta-dialog.html',
  styleUrl: './nueva-subasta-dialog.css',
})
export class NuevaSubastaDialog {
  alGuardar = output<any>();
  
  mostrarFormulario = signal<boolean>(false);

  nuevaSubasta = {
  isbn: '',
  nombre: '',
  autor: '',
  precioInicial: null as number | null
};
  //recibe subastas de padre
  subastas = input<any[]>([]);
  //para avisar que vamos a añadir una subasta
  alCrearSubasta = output<any>();
  clickCrear = output<void>();


  onCrear(): void {
    this.clickCrear.emit();
  }
  abrirFormulario(): void {
  this.mostrarFormulario.set(true);
  }

/**
 * Agrega el libro del formulario directamente a la Signal local sin tocar el backend
 */
agregarSubastaLocalmente(): void {
  // Validación 
  if (!this.nuevaSubasta.isbn || !this.nuevaSubasta.nombre || !this.nuevaSubasta.precioInicial) return;

  // Armamos la estructura 
  const nuevaSubastaCreada = {
    id: Math.floor(Math.random() * 1000), 
    nombre: this.nuevaSubasta.nombre,
    autor: this.nuevaSubasta.autor,
    isbn: this.nuevaSubasta.isbn,
    precioInicial: Number(this.nuevaSubasta.precioInicial),
    estado: 'PENDIENTE',
    subastas: []
  };

  this.alGuardar.emit(nuevaSubastaCreada);

  
  this.mostrarFormulario.set(false);
  this.resetearFormulario();

}

private resetearFormulario(): void {
  this.nuevaSubasta = {
    isbn: '',
    nombre: '',
    autor: '',
    precioInicial: null
  };
}
}

