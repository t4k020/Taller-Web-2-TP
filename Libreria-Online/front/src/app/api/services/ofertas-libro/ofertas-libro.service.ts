import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { NuevaOfertaLibro, OfertaLibro } from '../../../shared/interfaces/oferta-libro.interface';
import { OfertaLibroRest } from '../../mapper/ofertas-libro/oferta-libro.interface.rest';
import { OfertaLibroMapper } from '../../mapper/ofertas-libro/oferta-libro.mapper';

@Injectable({
  providedIn: 'root',
})
export class OfertasLibroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/api/ofertas`;

  listOfertas(): Observable<OfertaLibro[]> {
    return this.http.get<{ message: string; data: OfertaLibroRest[] }>(this.apiUrl).pipe(
      map((res) => OfertaLibroMapper.mapRestOfertaArrayToOfertaArrayFront(res.data))
    );
  }

  crearOferta(oferta: NuevaOfertaLibro): Observable<OfertaLibro> {
    return this.http.post<{ message: string; data: OfertaLibroRest }>(this.apiUrl, oferta).pipe(
      map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data))
    );
  }

  contraofertarAdmin(id: number, nuevaCantidad: number, nuevoPrecio?: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/admin/contraofertar/${id}`, {
        nuevaCantidad,
        ...(nuevoPrecio !== undefined ? { nuevoPrecio } : {}),
      })
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }

  contraofertarProveedor(id: number, nuevaCantidad: number, nuevoPrecio?: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/proveedor/contraofertar/${id}`, {
        nuevaCantidad,
        ...(nuevoPrecio !== undefined ? { nuevoPrecio } : {}),
      })
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }

  aceptarOferta(id: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/aceptar/${id}`, {})
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }

  rechazarOferta(id: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/rechazar/${id}`, {})
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }
}
