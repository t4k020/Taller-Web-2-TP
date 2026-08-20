export interface LibroRest {
  id: number;
  nombre: string;
  isbn: string;
  autor: string;
  precio: number;
  stock: number;
  archivoDigital?: string | null;
  sinopsis?: string;
  categoria?: string;
  imagen?: string;
}
