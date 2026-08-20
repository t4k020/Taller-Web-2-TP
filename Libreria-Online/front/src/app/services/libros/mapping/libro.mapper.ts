import { Libro } from '../../../shared/interfaces/libro.interface';
import { LibroRest } from './libro.interface.rest';

export class LibroMapper {
  static mapRestLibrotoLibroFrontU(libroRest: LibroRest): Libro {
    return {
      id: libroRest.id,
      nombre: libroRest.nombre,
      isbn: libroRest.isbn,
      autor: libroRest.autor,
      precio: libroRest.precio,
      stock: libroRest.stock,
      archivoDigital: libroRest.archivoDigital,
      sinopsis: libroRest.sinopsis,
      categoria: libroRest.categoria,
      imagenUrl: libroRest.imagen,
    };
  }

  static mapRestLibroArrayToLibroArrayFront(librosRest: LibroRest[]): Libro[] {
    return librosRest.map(this.mapRestLibrotoLibroFrontU);
  }
}
