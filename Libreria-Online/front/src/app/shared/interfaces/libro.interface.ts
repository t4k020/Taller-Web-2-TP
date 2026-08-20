export type CategoriaLibro =
  | 'FICCION'
  | 'FANTASIA'
  | 'TERROR'
  | 'HISTORIA'
  | 'INFANTIL'
  | 'GENERAL';

export const CATEGORIAS_LIBRO: CategoriaLibro[] = [
  'FICCION',
  'FANTASIA',
  'TERROR',
  'HISTORIA',
  'INFANTIL',
  'GENERAL',
];


export interface Libro {
  id: number;
  nombre: string;
  isbn: string;
  autor: string;
  precio: number;
  stock: number;

  sinopsis?: string;
  imagenUrl?: string | null;
  categoria?: string;
  archivoDigital?: string | null;
}


export type NuevoLibro = Omit<Libro, 'id'>;
export type LibroActualizacion = Omit<Libro, 'id' | 'stock'>;
