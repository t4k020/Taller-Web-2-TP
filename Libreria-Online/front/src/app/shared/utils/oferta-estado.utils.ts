import { EstadoOferta, OfertaLibro } from '../interfaces/oferta-libro.interface';

export function estadoOfertaLabel(estado: EstadoOferta): string {
  const labels: Record<EstadoOferta, string> = {
    ESPERANDO_ADMIN: 'Esperando admin',
    ESPERANDO_PROVEEDOR: 'Esperando proveedor',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',
  };

  return labels[estado];
}

export function estadoOfertaSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
  const severities: Record<EstadoOferta, 'success' | 'info' | 'warn' | 'danger'> = {
    ESPERANDO_ADMIN: 'info',
    ESPERANDO_PROVEEDOR: 'warn',
    ACEPTADA: 'success',
    RECHAZADA: 'danger',
  };

  return severities[estado];
}

export function puedeResponderOferta(oferta: OfertaLibro): boolean {
  return oferta.estado === 'ESPERANDO_PROVEEDOR';
}

export function cantidadVisibleOferta(oferta: OfertaLibro): number {
  return oferta.estado === 'ESPERANDO_PROVEEDOR' && oferta.cantidadAdmin
    ? oferta.cantidadAdmin
    : oferta.cantidadProveedor;
}
