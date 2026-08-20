import { CurrencyPipe } from '@angular/common';
import { Component, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { EstadoOferta, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';

@Component({
  selector: 'app-ofertas-table',
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
  templateUrl: './ofertas-table.html',
  styleUrl: './ofertas-table.css',
})
export class OfertasTable {
  ofertas = input.required<OfertaLibro[]>();
  cargando = input(false);

  aceptar = output<OfertaLibro>();
  contraofertar = output<OfertaLibro>();
  rechazar = output<OfertaLibro>();

  searchValue = signal('');
  tablaOfertas = viewChild<Table>('tablaOfertas');

  buscarOfertas(valor: string): void {
    this.searchValue.set(valor);
    this.tablaOfertas()?.filterGlobal(valor, 'contains');
  }

  puedeResponder(oferta: OfertaLibro): boolean {
    return oferta.estado === 'ESPERANDO_ADMIN';
  }

  cantidadActual(oferta: OfertaLibro): number {
    return oferta.estado === 'ESPERANDO_PROVEEDOR' && oferta.cantidadAdmin
      ? oferta.cantidadAdmin
      : oferta.cantidadProveedor;
  }

  estadoLabel(estado: EstadoOferta): string {
    const labels: Record<EstadoOferta, string> = {
      ESPERANDO_ADMIN: 'Esperando admin',
      ESPERANDO_PROVEEDOR: 'Esperando proveedor',
      ACEPTADA: 'Aceptada',
      RECHAZADA: 'Rechazada',
    };
    return labels[estado];
  }

  estadoSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<EstadoOferta, 'success' | 'info' | 'warn' | 'danger'> = {
      ESPERANDO_ADMIN: 'info',
      ESPERANDO_PROVEEDOR: 'warn',
      ACEPTADA: 'success',
      RECHAZADA: 'danger',
    };
    return severities[estado];
  }
}
