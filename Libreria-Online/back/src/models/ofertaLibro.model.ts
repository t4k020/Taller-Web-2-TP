import { Decimal } from "@prisma/client/runtime/client";
import { EstadoOferta, CategoriaLibro } from "../prisma/enums.js";

export class OfertaLibro {
  id!: number;
  isbn!: string;
  nombre!: string;
  autor!: string;
  precioProveedor!: Decimal;
  precioAdmin?: Decimal | null;
  cantidadAdmin!: number;
  cantidadProveedor!: number;
  estado!: EstadoOferta;
  createdAt!: Date;
  creadoPor!: string;
  libroId?: number | null;
  sinopsis!: string;
  imagenUrl!: string | null;
  categoria!: CategoriaLibro;
  proveedorId!: number;
}
