import { prisma } from "../prisma";
import { Prisma } from "../prisma/client";

export class CompradorRepository {
  async findAllComppradores() {
    const compradores = await prisma.compradores.findMany({
      include: {
        Usuarios: true,
      },
    });

    return compradores;
  }
}
