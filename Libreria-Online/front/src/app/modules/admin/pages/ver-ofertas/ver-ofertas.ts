import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { Nav } from '../../../../shared/components/nav/nav';
import { OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { ContraofertaAdminDialog } from '../../components/contraoferta-admin-dialog/contraoferta-admin-dialog';
import { OfertasTable } from '../../components/ofertas-table/ofertas-table';

@Component({
  selector: 'app-ver-ofertas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Nav,
    ToastModule,
    OfertasTable,
    ContraofertaAdminDialog,
  ],
  templateUrl: './ver-ofertas.html',
  styleUrl: './ver-ofertas.css',
})
export class VerOfertas {
  readonly userName = 'Maria Rodriguez';
  readonly role = 'admin';
  readonly activeItem = 'Ofertas';

  private fb = inject(NonNullableFormBuilder);
  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);

  ofertas = signal<OfertaLibro[]>([]);
  cargando = signal(true);
  respondiendo = signal(false);
  contraofertaVisible = signal(false);
  ofertaSeleccionada = signal<OfertaLibro | undefined>(undefined);

  contraofertaForm = this.fb.group({
    nuevaCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    nuevoPrecio: [null as number | null, [Validators.min(1)]],
  });

  private ordenarOfertas(ofertas: OfertaLibro[]): OfertaLibro[] {
    const prioridadEstado: Record<OfertaLibro['estado'], number> = {
      ESPERANDO_ADMIN: 0,
      ESPERANDO_PROVEEDOR: 1,
      ACEPTADA: 2,
      RECHAZADA: 3,
    };

    return [...ofertas].sort((a, b) => prioridadEstado[a.estado] - prioridadEstado[b.estado]);
  }

  constructor() {
    this.obtenerOfertas();
  }

  obtenerOfertas(): void {
    this.cargando.set(true);

    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.ofertas.set(this.ordenarOfertas(data));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al traer las ofertas', error);
        this.cargando.set(false);
        this.toastService.error('No se pudieron cargar las ofertas.');
      },
    });
  }

  abrirContraoferta(oferta: OfertaLibro): void {
    this.ofertaSeleccionada.set(oferta);
    this.contraofertaForm.reset({
      nuevaCantidad: oferta.cantidadAdmin ?? oferta.cantidadProveedor,
      nuevoPrecio: oferta.precioProveedor,
    });
    this.contraofertaVisible.set(true);
  }

  cerrarContraoferta(): void {
    this.contraofertaVisible.set(false);
    this.ofertaSeleccionada.set(undefined);
    this.contraofertaForm.reset();
  }

  enviarContraoferta(): void {
    const ofertaActual = this.ofertaSeleccionada();

    if (!ofertaActual || this.contraofertaForm.invalid) {
      this.contraofertaForm.markAllAsTouched();
      return;
    }

    this.respondiendo.set(true);
    const nuevaCantidad = this.contraofertaForm.value.nuevaCantidad!;
    const nuevoPrecio = this.contraofertaForm.value.nuevoPrecio ?? undefined;

    this.ofertasService.contraofertarAdmin(ofertaActual.id, nuevaCantidad, nuevoPrecio).subscribe({
      next: () => {
        this.respondiendo.set(false);
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al responder la contraoferta', error);
        this.respondiendo.set(false);
        this.toastService.error('No se pudo enviar la contraoferta.');
      },
    });
  }

  aceptarOferta(oferta: OfertaLibro): void {
    this.ofertasService.aceptarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.updated('Oferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al aceptar la oferta', error);
        this.toastService.error('No se pudo aceptar la oferta.');
      },
    });
  }

  rechazarOferta(oferta: OfertaLibro): void {
    this.ofertasService.rechazarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.error('Oferta rechazada');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al rechazar la oferta', error);
        this.toastService.error('No se pudo rechazar la oferta.');
      },
    });
  }
}
