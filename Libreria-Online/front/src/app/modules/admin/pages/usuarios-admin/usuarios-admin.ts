import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import {
  UsuarioActualizacionPayload,
  UsuarioListado,
  UsuarioService,
} from '../../../../api/services/usuario/usuario-service';
import { Nav } from '../../../../shared/components/nav/nav';
import { ToastService } from '../../../../shared/services/toast.service';

interface TipoUsuarioOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    CommonModule,
    Nav,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css',
})
export class UsuariosAdmin {
  compact = input(false);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  usuarios = signal<UsuarioListado[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  accionEnProgreso = signal(false);
  usuarioEditando = signal<UsuarioListado | null>(null);
  usuarioAEliminar = signal<UsuarioListado | null>(null);
  mostrarDialogoEdicion = signal(false);
  mostrarDialogoEliminar = signal(false);

  tipoUsuarioOpciones: TipoUsuarioOption[] = [
    { label: 'Administrador', value: 1 },
    { label: 'Proveedor', value: 2 },
    { label: 'Comprador', value: 3 },
  ];

  usuarioForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
    tipoUsuarioId: [1, [Validators.required]],
  });

  esAdministrador(usuario: UsuarioListado): boolean {
    return usuario.tipoUsuarioId === 1 || usuario.tipoUsuarioDescripcion?.toUpperCase().includes('ADMIN');
  }

  constructor() {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.listUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      },
    });
  }

  abrirEdicion(usuario: UsuarioListado): void {
    if (this.esAdministrador(usuario)) {
      this.toastService.warn('Los usuarios administradores no se pueden modificar.');
      return;
    }

    this.usuarioEditando.set(usuario);
    this.usuarioForm.reset({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      tipoUsuarioId: usuario.tipoUsuarioId,
    });
    this.mostrarDialogoEdicion.set(true);
  }

  cerrarEdicion(): void {
    this.mostrarDialogoEdicion.set(false);
    this.usuarioEditando.set(null);
    this.usuarioForm.reset({
      nombre: '',
      apellido: '',
      direccion: '',
      tipoUsuarioId: 1,
    });
  }

  guardarEdicion(): void {
    const usuarioActual = this.usuarioEditando();

    if (!usuarioActual || this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const datos = this.usuarioForm.getRawValue() as {
      nombre: string;
      apellido: string;
      direccion: string;
      tipoUsuarioId: number;
    };

    const payload: UsuarioActualizacionPayload = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      direccion: datos.direccion,
      tipo_usuario_id: Number(datos.tipoUsuarioId),
    };

    this.accionEnProgreso.set(true);
    this.usuarioService.updateUsuario(usuarioActual.id, payload).subscribe({
      next: () => {
        this.accionEnProgreso.set(false);
        this.toastService.updated('Usuario');
        this.cerrarEdicion();
        this.cargarUsuarios();
      },
      error: (error) => {
        this.accionEnProgreso.set(false);
        console.error('Error al actualizar el usuario', error);
        this.toastService.error('No se pudo actualizar el usuario.');
      },
    });
  }

  abrirEliminacion(usuario: UsuarioListado): void {
    if (this.esAdministrador(usuario)) {
      this.toastService.warn('Los usuarios administradores no se pueden eliminar.');
      return;
    }

    this.usuarioAEliminar.set(usuario);
    this.mostrarDialogoEliminar.set(true);
  }

  cerrarEliminacion(): void {
    this.mostrarDialogoEliminar.set(false);
    this.usuarioAEliminar.set(null);
  }

  eliminarUsuario(): void {
    const usuario = this.usuarioAEliminar();

    if (!usuario) {
      return;
    }

    this.accionEnProgreso.set(true);
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.accionEnProgreso.set(false);
        this.toastService.deleted('Usuario');
        this.cerrarEliminacion();
        this.cargarUsuarios();
      },
      error: (error) => {
        this.accionEnProgreso.set(false);
        console.error('Error al eliminar el usuario', error);
        this.toastService.error('No se pudo eliminar el usuario.');
      },
    });
  }
}
