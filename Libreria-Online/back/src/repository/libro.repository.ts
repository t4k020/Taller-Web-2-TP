import { prisma } from "../prisma.js";
import { Libro } from "../models/libro.model.js";
import { CategoriaLibro } from "../prisma/enums.js";

export class LibroRepository {
  async findAllLibros() {
    const libros = await prisma.libros.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return libros;
  }

  async findLibroById(id: number): Promise<Libro | null> {
    const data = await prisma.libros.findUnique({ where: { id } });

    if (!data) return null;

    // Mapeo manual para cumplir con tu modelo Libro
    const libro = new Libro();
    libro.id = data.id;
    libro.nombre = data.nombre;
    libro.isbn = data.isbn;
    libro.autor = data.autor;
    libro.precio = Number(data.precio); // Convertimos Decimal a number
    libro.stock = data.stock ?? 0; // Si es null, ponemos 0
    libro.archivoDigital = data.archivoDigital ?? undefined;
    libro.sinopsis = data.sinopsis ?? "";
    libro.imagenUrl = data.imagenUrl;
    libro.categoria = data.categoria;

    return libro;
  }

  async findLibroByIsbn(isbn: string) {
    return await prisma.libros.findUnique({
      where: { isbn },
    });
  }

  async createLibro(data: {
    nombre: string;
    isbn: string;
    precio: number;
    autor: string;
    stock: number;
    categoria: CategoriaLibro;
    sinopsis: string;
    imagenUrl?: string | null;
  }) {
    return await prisma.libros.create({ data });
  }

  async updateLibro(
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
    return await prisma.libros.update({
      where: { id },
      data,
    });
  }

  async deleteLibro(id: number) {
    return await prisma.libros.delete({
      where: { id },
    });
  }

  async incrementarStock(id: number, cantidad: number) {
    return await prisma.libros.update({
      where: { id },
      data: { stock: { increment: cantidad } },
    });
  }

  async incrementarStockYActualizarPrecio(
    id: number,
    cantidad: number,
    precio: number,
  ) {
    return await prisma.libros.update({
      where: { id },
      data: {
        stock: { increment: cantidad },
        precio,
      },
    });
  }

  async actualizarStockTrasCompra(detalles: any[], tx: any) {
    for (const item of detalles) {
      const nuevoStock = (item.Libros.stock || 0) - item.cantidad;

      await tx.libros.update({
        where: { id: item.libro_id },
        data: {
          stock: nuevoStock,
          estado: nuevoStock <= 0 ? "AGOTADO" : "DISPONIBLE",
        },
      });
    }
  }

  async findAllLibrosConStock() {
    const libros = await prisma.libros.findMany({
      where: {
        stock: { gt: 0 },
      },
    });

    return libros;
  }
}
