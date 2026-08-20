import { CategoriaLibro } from './libro.interface';

export type EstadoOferta =
  | 'ESPERANDO_ADMIN'
  | 'ESPERANDO_PROVEEDOR'
  | 'ACEPTADA'
  | 'RECHAZADA';

export interface OfertaLibro {
  id: number;
  isbn: string;
  nombre: string;
  autor: string;
  precioProveedor: number;
  precioAdmin?: number | null;
  cantidadProveedor: number;
  cantidadAdmin?: number | null;
  estado: EstadoOferta;
  createdAt?: string;
  libroId?: number | null;
  sinopsis?: string | null;
  imagenUrl?: string | null;
  categoria: CategoriaLibro;
  proveedorId?: number;
  creadoPor?: string;
}

export type NuevaOfertaLibro = Omit<OfertaLibro, 'id' | 'estado' | 'createdAt' | 'cantidadAdmin' | 'precioAdmin'>;
