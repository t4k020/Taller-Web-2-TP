import { Libro } from "../models/libro.model";
import { prisma } from "../prisma";
import { Prisma } from "../prisma/client";

export class CarritoRepository {
  async findCarritoByID(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        id: id,
      },
    });

    return carrito;
  }
  async agregarLibroAlCarrito(
    carritoId: number,
    libro: Libro,
    cantidad: number,
    esDigital: boolean = false,
  ) {
    const subtotal = Number(libro.precio) * cantidad;

    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallesCarrito.upsert({
        where: {
          carrito_id_libro_id_es_digital: {
            carrito_id: carritoId,
            libro_id: libro.id,
            es_digital: esDigital,
          },
        },
        update: {
          cantidad: { increment: cantidad },
          precio: { increment: subtotal },
        },
        create: {
          carrito_id: carritoId,
          libro_id: libro.id,
          cantidad: cantidad,
          precio: subtotal,
          es_digital: esDigital,
        },
      });

      await tx.carritos.update({
        where: { id: carritoId },
        data: {
          precio_total: { increment: subtotal },
        },
      });

      if (!esDigital) {
        await tx.libros.update({
          where: { id: libro.id },
          data: {
            stock: { decrement: cantidad },
          },
        });
      }

      return detalle;
    });
  }
  async findCarrito(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        comprador_id: id,
      },
      include: {
        detalles: {
          include: {
            Libros: true,
          },
        },
      },
    });

    if (!carrito) {
      return null;
    }

    return carrito;
  }

  async findCarritoConDetalles(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        comprador_id: id,
      },
      include: {
        detalles: {
          include: {
            Libros: true,
          },
          orderBy: {
            libro_id: "asc",
          },
        },
      },
    });

    if (!carrito) {
      return null;
    }

    return carrito;
  }

  async findCarritoByIdComprador(compradorId: number, tx: any) {
    return await tx.carritos.findUniqueOrThrow({
      where: { comprador_id: compradorId },
      include: { detalles: { include: { Libros: true } } },
    });
  }

  async limpiarCarrito(carritoId: number, tx: any) {
    await tx.detallesCarrito.deleteMany({ where: { carrito_id: carritoId } });
    await tx.carritos.update({
      where: { id: carritoId },
      data: { precio_total: 0 },
    });
  }
  async eliminarProductoDelCarrito(
    carritoId: number,
    libroId: number,
    esDigital: boolean = false,
  ) {
    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallesCarrito.findUnique({
        where: {
          carrito_id_libro_id_es_digital: {
            carrito_id: carritoId,
            libro_id: libroId,
            es_digital: esDigital,
          },
        },
      });

      if (!detalle) throw new Error("Producto no encontrado en el carrito");

      if (!esDigital) {
        await tx.libros.update({
          where: {
            id: libroId,
          },
          data: {
            stock: { increment: detalle.cantidad },
          },
        });
      }

      await tx.detallesCarrito.delete({
        where: {
          carrito_id_libro_id_es_digital: {
            carrito_id: carritoId,
            libro_id: libroId,
            es_digital: esDigital,
          },
        },
      });

      await tx.carritos.update({
        where: { id: carritoId },
        data: {
          precio_total: { decrement: detalle.precio },
        },
      });

      return { message: "Producto eliminado correctamente" };
    });
  }

  async disminuirProductoCarrito(
    carritoId: number,
    libro: Libro,
    cantidad: number,
  ) {
    const subtotal = Number(libro.precio) * cantidad;

    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallesCarrito.upsert({
        where: {
          carrito_id_libro_id_es_digital: {
            carrito_id: carritoId,
            libro_id: libro.id,
            es_digital: false,
          },
        },
        update: {
          cantidad: { decrement: cantidad },
          precio: { decrement: subtotal },
        },
        create: {
          carrito_id: carritoId,
          libro_id: libro.id,
          cantidad: cantidad,
          precio: subtotal,
        },
      });

      await tx.carritos.update({
        where: { id: carritoId },
        data: {
          precio_total: { decrement: subtotal },
        },
      });

      await tx.libros.update({
        where: { id: libro.id },
        data: {
          stock: { increment: cantidad },
        },
      });

      return detalle;
    });
  }
}
