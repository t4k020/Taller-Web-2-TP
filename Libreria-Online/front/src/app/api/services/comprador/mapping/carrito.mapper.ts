import { Carrito } from '../../../../modules/carrito/interfaces/carrito.interface';
import { CarritoRest } from './carrito.interface.rest';

export class CarritoMapper {
  static mapRestCarritoToCarrioFront(carritoRest: CarritoRest): Carrito {
    return {
      id: carritoRest.id,
      comprador_id: carritoRest.comprador_id,
      precio_total: carritoRest.precio_total,
      detalles: carritoRest.detalles,
    };
  }
  static mapRestCarritoArrayToCarritoArrayFront(carritoRest: CarritoRest[]): Carrito[] {
    return carritoRest.map(this.mapRestCarritoToCarrioFront);
  }
}
