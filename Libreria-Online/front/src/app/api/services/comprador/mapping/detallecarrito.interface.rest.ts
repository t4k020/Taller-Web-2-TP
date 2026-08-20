import { LibroRest } from '../../../../services/libros/mapping/libro.interface.rest';
import { Libro } from '../../../../shared/interfaces/libro.interface';

export interface DetalleCarritoRest {
  id: number;
  carrito_id: number;
  libro_id: number;
  cantidad: number;
  precio: number;
  es_digital: boolean;
  Libros: Libro;
}
