import type { LibroRepository } from "../repository/libro.repository.js";
import { Libro } from "../models/libro.model.js";
import { CategoriaLibro } from "../prisma/enums.js";

export class LibroService {
  constructor(private libroRepository: LibroRepository) {}
  async obtenerLibros() {
    return await this.libroRepository.findAllLibros();
  }

  async obtenerLibrosConStock() {
    return await this.libroRepository.findAllLibrosConStock();
  }

  async obtenerLibroPorId(id: number) {
    return await this.libroRepository.findLibroById(id);
  }

  async obtenerLibroPorIsbn(isbn: string) {
    return await this.libroRepository.findLibroByIsbn(isbn);
  }

  async crearLibro(libro: Libro) {
    const {
      nombre,
      isbn,
      precio,
      autor,
      stock,
      categoria,
      sinopsis,
      imagenUrl,
    } = libro;

    if (
      !nombre ||
      !isbn ||
      !autor ||
      precio == null ||
      stock == null ||
      !categoria
    ) {
      throw new Error("Faltan campos obligatorios para crear el libro");
    }

    return await this.libroRepository.createLibro({
      nombre,
      isbn,
      precio,
      autor,
      stock,
      categoria,
      sinopsis,
      imagenUrl,
    });
  }

  async actualizarLibro(
    id: number,
    data: {
      nombre: string;
      isbn: string;
      precio: number;
      autor: string;
      categoria: CategoriaLibro;
      sinopsis: string;
      imagenUrl?: string | null;
    },
  ) {
    return await this.libroRepository.updateLibro(id, data);
  }

  async sumarStock(id: number, cantidad: number) {
    return await this.libroRepository.incrementarStock(id, cantidad);
  }

  async sumarStockYActualizarPrecio(id: number, cantidad: number, precio: number) {
    return await this.libroRepository.incrementarStockYActualizarPrecio(id, cantidad, precio);
  }

  async eliminarLibro(id: number) {
    try {
      await this.libroRepository.deleteLibro(id);
      return { message: "Libro eliminado correctamente" };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Libro no encontrado. No se pudo eliminar.");
      }
      throw new Error("Error al eliminar el libro: " + error.message);
    }
  }
}
