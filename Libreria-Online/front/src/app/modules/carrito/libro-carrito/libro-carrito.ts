import { Component, input, output } from '@angular/core';
import { DetalleCarrito } from '../interfaces/detallecarrito.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-libro-carrito',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './libro-carrito.html',
  styleUrl: './libro-carrito.css',
})
export class LibroCarrito {
  detalle = input.required<DetalleCarrito>();

  onEliminar = output<DetalleCarrito>();
  onRestar = output<number>();
  onAumentar = output<number>();

  borrar() {
    this.onEliminar.emit(this.detalle());
  }

  restar() {
    this.onRestar.emit(this.detalle().libro_id);
  }

  aumentar() {
    this.onAumentar.emit(this.detalle().libro_id);
  }
}
