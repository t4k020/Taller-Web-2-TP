import { DetalleCarrito } from './detallecarrito.interface';

export interface Carrito {
  id: number;
  comprador_id: number;
  precio_total: number;
  detalles: DetalleCarrito[];
}
