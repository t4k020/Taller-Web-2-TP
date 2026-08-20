import type { LibroDigitalRepository } from '../repository/libro-digital.repository.js';
import { prisma } from '../prisma.js';

export class LibroDigitalService {

    constructor(private libroDigitalRepository: LibroDigitalRepository) {}

    async obtenerLibrosAdquiridos(compradorId: number) {
        return await this.libroDigitalRepository.findAdquiridosByComprador(compradorId);
    }

    async adquirirLibro(compradorId: number, libroId: number) {
        const libro = await prisma.libros.findUnique({ where: { id: libroId } });

        if (!libro) {
            throw new Error('Libro no encontrado');
        }

        if (!libro.archivoDigital) {
            throw new Error('El libro no tiene versión digital disponible');
        }

        const yaAdquirido = await this.libroDigitalRepository.findAdquisicion(compradorId, libroId);

        if (yaAdquirido) {
            throw new Error('El comprador ya posee este libro digital');
        }

        return await this.libroDigitalRepository.createAdquisicion(compradorId, libroId);
    }

    async verificarPosesion(compradorId: number, libroId: number) {
        const adquisicion = await this.libroDigitalRepository.findAdquisicion(compradorId, libroId);
        return adquisicion !== null;
    }

    async obtenerArchivoDigital(compradorId: number, libroId: number) {
        const posee = await this.verificarPosesion(compradorId, libroId);

        if (!posee) {
            throw new Error('Acceso denegado: el comprador no posee este libro digital');
        }

        const libro = await prisma.libros.findUnique({ where: { id: libroId } });

        if (!libro?.archivoDigital) {
            throw new Error('El libro no tiene archivo digital asociado');
        }

        return libro.archivoDigital;
    }
}
