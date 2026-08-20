import { Libro } from '../../../shared/interfaces/libro.interface';

export interface DetalleCarrito {
  id: number;
  carrito_id: number;
  libro_id: number;
  cantidad: number;
  precio: number;
  es_digital: boolean;
  Libros: Libro;
}
