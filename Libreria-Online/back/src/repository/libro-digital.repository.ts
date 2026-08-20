import { prisma } from '../prisma.js';

export class LibroDigitalRepository {

    async findAdquiridosByComprador(compradorId: number) {
        return await prisma.libroDigitalAdquirido.findMany({
            where: { comprador_id: compradorId },
            include: { Libros: true }
        });
    }

    async findAdquisicion(compradorId: number, libroId: number) {
        return await prisma.libroDigitalAdquirido.findUnique({
            where: {
                comprador_id_libro_id: {
                    comprador_id: compradorId,
                    libro_id: libroId
                }
            }
        });
    }

    async createAdquisicion(compradorId: number, libroId: number) {
        return await prisma.libroDigitalAdquirido.create({
            data: {
                comprador_id: compradorId,
                libro_id: libroId
            }
        });
    }
}
