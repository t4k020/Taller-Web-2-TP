import { prisma } from "../prisma.js";
import { Prisma } from "../prisma/client.js";

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
