import { DetalleCarritoRest } from './detallecarrito.interface.rest';

export interface CarritoRest {
  id: number;
  comprador_id: number;
  precio_total: number;
  detalles: DetalleCarritoRest[];
}
