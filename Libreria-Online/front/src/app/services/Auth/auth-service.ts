import { inject, Injectable, signal } from '@angular/core';
import { UsuarioPrueba } from '../../modules/usuario/usuario.interface';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _tipoUsuario = signal<string | null>(null);
  private _usuario = signal<UsuarioPrueba | null>(null);
  public tipoUsuario = this._tipoUsuario.asReadonly();
  private authState = new BehaviorSubject<boolean>(!!localStorage.getItem('usuario'));
  authState$ = this.authState.asObservable();

  router = inject(Router);

  constructor() {
    const rolGuardado = localStorage.getItem('role');
    if (rolGuardado) {
      this._tipoUsuario.set(rolGuardado);
    }

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this._usuario.set(JSON.parse(usuarioGuardado));
    }
  }

  setSesion(tipo: number, usuario: UsuarioPrueba) {
    const roleName = this.roleMap[tipo];
    this._tipoUsuario.set(roleName);
    this._usuario.set(usuario);

    localStorage.setItem('role', roleName);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.authState.next(true);
  }

  logout() {
    this._tipoUsuario.set(null);
    this._usuario.set(null);
    localStorage.removeItem('role');
    localStorage.removeItem('usuario');
    this.authState.next(false);
  }

  getUser() {
    const usuario = localStorage.getItem('usuario') || '';
    if (usuario !== '') {
      return JSON.parse(usuario).id;
    } else {
      return null;
    }
  }

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    
    
    if (!usuario) {
      return null; 
    }

    try {
      return JSON.parse(usuario);
    } catch (error) {
      
      return null;
    }
  }

  private roleMap: Record<number, string> = {
    1: 'ADMIN',
    2: 'PROVEEDOR',
    3: 'COMPRADOR',
  };
}
