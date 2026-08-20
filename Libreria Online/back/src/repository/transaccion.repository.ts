import { prisma } from '../prisma.js';
import type { Prisma } from '../prisma/client.js';

type CarritoConDetalles = Prisma.CarritosGetPayload<{
  include: { detalles: true };
}>;
export class TransaccionRepository {
  async crear(compradorId: number, carrito: any, tx: any) {
    return await tx.transacciones.create({
      data: {
        comprador_id: compradorId,
        monto_total: carrito.precio_total,
        detalles: {
          create: carrito.detalles.map((d: any) => ({
            libro_id: d.libro_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio,
          })),
        },
      },
    });
  }
}
