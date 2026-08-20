import { prisma } from "../prisma.js";
import { CarritoRepository } from "../repository/carrito.repository.js";
import { CompradorRepository } from "../repository/comprador.repository.js";
import { LibroDigitalRepository } from "../repository/libro-digital.repository.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { TransaccionRepository } from "../repository/transaccion.repository.js";

export class CompradorService {
  constructor(
    private compradorRepository: CompradorRepository,
    private libroRepository: LibroRepository,
    private carritoRepository: CarritoRepository,
    private transaccionRepository: TransaccionRepository,
    private libroDigitalRepository: LibroDigitalRepository,
  ) {}

  async obtenerCompradores() {
    return await this.compradorRepository.findAllComppradores();
  }
  async obtenerCarrito(comprador_id: number) {
    return await this.carritoRepository.findCarritoConDetalles(comprador_id);
  }

  async agregarProducto(
    compradorId: number,
    libroId: number,
    cantidad: number,
    esDigital: boolean = false,
  ) {
    // 1. Buscar libro
    const libro = await this.libroRepository.findLibroById(libroId);
    if (!libro) {
      throw new Error("El libro no existe.");
    }

    if (esDigital) {
      if (!libro.archivoDigital) {
        throw new Error("El libro no tiene versión digital disponible.");
      }

      const yaAdquirido = await this.libroDigitalRepository.findAdquisicion(
        compradorId,
        libroId,
      );
      if (yaAdquirido) {
        throw new Error("Ya posees este libro digital.");
      }

      cantidad = 1;
    } else {
      // Validar stock (usando tu modelo)
      if (libro.stock < cantidad) {
        throw new Error("No hay stock suficiente.");
      }
    }

    // Buscar carrito
    const carrito = await this.carritoRepository.findCarrito(compradorId);

    // Validar existencia estricta (no creamos nada nuevo)
    if (!carrito || !carrito.id) {
      throw new Error("Carrito no encontrado para este comprador.");
    }

    if (esDigital) {
      const yaEnCarrito = carrito.detalles?.some(
        (d) => d.libro_id === libroId && d.es_digital,
      );
      if (yaEnCarrito) {
        throw new Error("El libro digital ya está en el carrito.");
      }
    }

    return await this.carritoRepository.agregarLibroAlCarrito(
      carrito.id,
      libro,
      cantidad,
      esDigital,
    );
  }

  async borrarProducto(
    compradorId: number,
    libroId: number,
    esDigital: boolean = false,
  ) {
    const libro = await this.libroRepository.findLibroById(libroId);
    if (!libro) {
      throw new Error("El libro no existe.");
    }
    const carrito = await this.carritoRepository.findCarrito(compradorId);

    if (!carrito || !carrito.id) {
      throw new Error("Carrito no encontrado para este comprador.");
    }

    return await this.carritoRepository.eliminarProductoDelCarrito(
      carrito.id,
      libro.id,
      esDigital,
    );
  }

  async procesarAbono(compradorId: number) {
    return await prisma.$transaction(async (tx) => {
      const carrito = await this.carritoRepository.findCarritoByIdComprador(
        compradorId,
        tx,
      );

      if (!carrito || !carrito.detalles || carrito.detalles.length === 0) {
        throw new Error("Carrito vacio.");
      }

      const transaccion = await this.transaccionRepository.crear(
        compradorId,
        carrito,
        tx,
      );

      for (const detalle of carrito.detalles) {
        if (detalle.es_digital) {
          await tx.libroDigitalAdquirido.create({
            data: {
              comprador_id: compradorId,
              libro_id: detalle.libro_id,
            },
          });
        }
      }

      await this.carritoRepository.limpiarCarrito(carrito.id, tx);

      return transaccion;
    });
  }

  async descontarProducto(
    compradorId: number,
    libroId: number,
    cantidad: number,
  ) {
    // 1. Buscar libro
    const libro = await this.libroRepository.findLibroById(libroId);
    if (!libro) {
      throw new Error("El libro no existe.");
    }

    // 3. Buscar carrito
    const carrito = await this.carritoRepository.findCarrito(compradorId);

    carrito?.detalles.map((d) => {
      if (d.libro_id == libroId && !d.es_digital) {
        if (d.cantidad - cantidad <= 0) {
          throw new Error("No se puede disminuir mas");
        }
      }
      if (d.libro_id == libroId && d.es_digital) {
        throw new Error(
          "No se puede modificar la cantidad de un libro digital.",
        );
      }
    });

    if (!carrito || !carrito.id) {
      throw new Error("Carrito no encontrado para este comprador.");
    }

    return await this.carritoRepository.disminuirProductoCarrito(
      carrito.id,
      libro,
      cantidad,
    );
  }
}

// 4. Validar existencia estricta (no creamos nada nuevo)
