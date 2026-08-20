import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Carrito } from '../../../modules/carrito/interfaces/carrito.interface';
import { CarritoRest } from './mapping/carrito.interface.rest';
import { environment } from '../../../../environments/environment';
import { CarritoMapper } from './mapping/carrito.mapper';

@Injectable({
  providedIn: 'root',
})
export class CompradorService {
  http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/api/comprador`;

  getCarritoUsuario(comprador_id: number): Observable<Carrito> {
    return this.http
      .get<CarritoRest>(`${this.apiUrl}/carrito/${comprador_id}`) // <-- Sin []
      .pipe(
        map((res) => {
          return CarritoMapper.mapRestCarritoToCarrioFront(res);
        }),
      );
  }

  agregarProductoAlCarrito(datos: {
    comprador_id: number;
    libro_id: number;
    cantidad: number;
    es_digital?: boolean;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarProducto`, datos);
  }

  borrarProducto(datos: {
    comprador_id: number;
    libro_id: number;
    es_digital?: boolean;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrarProducto`, datos);
  }

  procesarPago(datos: { comprador_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesarPago`, datos);
  }

  descontarProducto(datos: {
    comprador_id: number;
    libro_id: number;
    cantidad: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/descontarProducto`, datos);
  }
}
