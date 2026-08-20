import { OfertaLibro } from "../../../shared/interfaces/oferta-libro.interface";

export interface OfertaLibroRest extends Omit<OfertaLibro, 'precioProveedor' | 'precioAdmin'> {
  precioProveedor: number | string;
  precioAdmin?: number | string | null;
}
