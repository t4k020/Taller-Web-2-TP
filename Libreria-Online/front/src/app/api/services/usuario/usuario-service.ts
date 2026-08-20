import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface UsuarioListadoRest {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipo_usuario_id: number;
  tipo_usuario_descripcion: string;
}

export interface UsuarioListado {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipoUsuarioId: number;
  tipoUsuarioDescripcion: string;
}

export interface UsuarioActualizacionPayload {
  nombre: string;
  apellido: string;
  direccion: string;
  tipo_usuario_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/api/usuarios`;

  listUsuarios(): Observable<UsuarioListado[]> {
    return this.http.get<UsuarioListadoRest[]>(this.apiUrl).pipe(
      map((usuarios) =>
        usuarios.map((usuario) => ({
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          direccion: usuario.direccion,
          tipoUsuarioId: usuario.tipo_usuario_id,
          tipoUsuarioDescripcion: usuario.tipo_usuario_descripcion,
        })),
      ),
    );
  }

  login(datos: { email: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciarSesion`, datos);
  }

  registrar(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrarse`, datos);
  }

  updateUsuario(id: number, datos: UsuarioActualizacionPayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, datos);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
