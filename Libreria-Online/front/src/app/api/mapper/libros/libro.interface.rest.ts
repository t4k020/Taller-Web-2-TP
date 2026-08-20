import { CategoriaLibro } from '../../../shared/interfaces/libro.interface';

export interface LibroRest {
  id: number;
  nombre: string;
  isbn: string;
  autor: string;
  precio: number | string;
  stock: number;
  sinopsis?: string | null;
  imagenUrl?: string | null;
  categoria?: CategoriaLibro | null;
  archivoDigital?: string | null;
}
