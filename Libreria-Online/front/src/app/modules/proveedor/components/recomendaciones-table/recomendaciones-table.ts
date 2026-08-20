import { Component, computed, input, output, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { IsbnLookupService } from '../../../../api/services/isbn-lookup/isbn-lookup.service';
import { EstadoOferta, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import {
  estadoOfertaLabel,
  estadoOfertaSeverity,
  puedeResponderOferta,
} from '../../../../shared/utils/oferta-estado.utils';

@Component({
  selector: 'app-recomendaciones-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    TagModule,
  ],
  templateUrl: './recomendaciones-table.html',
  styleUrl: './recomendaciones-table.css',
})
export class RecomendacionesTable {
  readonly portadaFallback = '/img/portada/imagen-no-disponible-vertical.svg';

  recomendaciones = input.required<OfertaLibro[]>();
  cargando = input(false);
  recomendacionesOrdenadas = computed(() =>
    [...this.recomendaciones()].sort((a, b) => {
      const prioridad = this.prioridadEstado(a.estado) - this.prioridadEstado(b.estado);

      if (prioridad !== 0) {
        return prioridad;
      }

      return this.fechaOrden(b) - this.fechaOrden(a) || b.id - a.id;
    })
  );

  aceptar = output<OfertaLibro>();
  contraofertar = output<OfertaLibro>();
  rechazar = output<OfertaLibro>();

  searchValue = signal('');
  tablaRecomendaciones = viewChild<Table>('tablaRecomendaciones');

  constructor(private isbnLookup: IsbnLookupService) {}

  buscarRecomendaciones(valor: string): void {
    this.searchValue.set(valor);
    this.tablaRecomendaciones()?.filterGlobal(valor, 'contains');
  }

  portadaUrl(recomendacion: OfertaLibro): string {
    return recomendacion.imagenUrl?.trim() || this.isbnLookup.portadaUrl(recomendacion.isbn);
  }

  usarPortadaFallback(event: Event): void {
    const imagen = event.target as HTMLImageElement;
    if (!imagen.src.endsWith(this.portadaFallback)) {
      imagen.src = this.portadaFallback;
    }
  }

  puedeResponder(recomendacion: OfertaLibro): boolean {
    return puedeResponderOferta(recomendacion);
  }

  estadoLabel(estado: EstadoOferta): string {
    return estadoOfertaLabel(estado);
  }

  estadoFilaLabel(recomendacion: OfertaLibro): string {
    if (this.esSolicitudAdmin(recomendacion) && recomendacion.estado === 'ESPERANDO_PROVEEDOR') {
      return 'Solicitud recibida';
    }

    return this.estadoLabel(recomendacion.estado);
  }

  estadoSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
    return estadoOfertaSeverity(estado);
  }

  cantidadVisible(recomendacion: OfertaLibro): number {
    return recomendacion.cantidadProveedor;
  }

  textoCantidadAdmin(recomendacion: OfertaLibro): string {
    const cantidad = recomendacion.cantidadAdmin ?? 0;
    return this.esSolicitudAdmin(recomendacion)
      ? `Admin solicito ${cantidad}`
      : `Admin propuso ${cantidad}`;
  }

  cantidadAdminSeverity(recomendacion: OfertaLibro): 'info' | 'warn' {
    return this.esSolicitudAdmin(recomendacion) ? 'info' : 'warn';
  }

  textoAccionAceptar(recomendacion: OfertaLibro): string {
    return this.esSolicitudAdmin(recomendacion)
      ? 'Aceptar solicitud y enviar al administrador'
      : 'Aceptar propuesta del admin y enviar al administrador';
  }

  textoAccionResponder(recomendacion: OfertaLibro): string {
    return this.esSolicitudAdmin(recomendacion)
      ? 'Responder solicitud'
      : 'Modificar y enviar una nueva contraoferta';
  }

  textoAccionRechazar(recomendacion: OfertaLibro): string {
    return this.esSolicitudAdmin(recomendacion) ? 'Rechazar solicitud' : 'Rechazar contraoferta';
  }

  esSolicitudAdmin(recomendacion: OfertaLibro): boolean {
    return recomendacion.creadoPor === 'ADMIN' && recomendacion.cantidadProveedor === 0;
  }

  private prioridadEstado(estado: EstadoOferta): number {
    return estado === 'ESPERANDO_ADMIN' || estado === 'ESPERANDO_PROVEEDOR' ? 0 : 1;
  }

  private fechaOrden(recomendacion: OfertaLibro): number {
    return recomendacion.createdAt ? new Date(recomendacion.createdAt).getTime() : 0;
  }
}
