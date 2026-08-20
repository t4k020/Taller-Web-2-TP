import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Proveedor, Usuario } from '../../../shared/interfaces/usuario.interface';
import { ProveedorMapper } from '../../mapper/usuarios/usuario.mapper';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.API_URL}/api/proveedor/`;

  listProveedores(isbn?: string): Observable<{ lista: Proveedor[], sugeridoId: number | null }> {

    const url = isbn ? `${this.apiUrl}?isbn=${isbn}` : this.apiUrl;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return {
          lista: ProveedorMapper.mapRestUsuarioArrayToProveedorArrayFront(res.proveedores || []),
          sugeridoId: res.proveedorSugeridoId || null
        };
      })
    );
  }

}
