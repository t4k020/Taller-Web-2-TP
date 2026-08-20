import { type Request, type Response } from 'express';
import path from 'path';
import { LibroDigitalService } from '../services/libro-digital.service.js';
import { LibroDigitalRepository } from '../repository/libro-digital.repository.js';

const libroDigitalRepository = new LibroDigitalRepository();
const libroDigitalService = new LibroDigitalService(libroDigitalRepository);

export class LibroDigitalController {

    public getLibrosAdquiridos = async (req: Request, res: Response) => {
        const compradorId = Number(req.params.compradorId);

        if (isNaN(compradorId)) {
            return res.status(400).json({ error: 'ID de comprador inválido. Debe ser un número.' });
        }

        try {
            const adquiridos = await libroDigitalService.obtenerLibrosAdquiridos(compradorId);
            res.status(200).json({ message: 'Libros digitales obtenidos correctamente', data: adquiridos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los libros digitales', errorDetails: error });
        }
    }

    public adquirirLibro = async (req: Request, res: Response) => {
        const { compradorId, libroId } = req.body;

        if (!compradorId || !libroId || isNaN(Number(compradorId)) || isNaN(Number(libroId))) {
            return res.status(400).json({ error: 'compradorId y libroId son requeridos y deben ser números.' });
        }

        try {
            const adquisicion = await libroDigitalService.adquirirLibro(Number(compradorId), Number(libroId));
            res.status(201).json({ message: 'Libro digital adquirido correctamente', data: adquisicion });
        } catch (error: any) {
            if (error.message === 'Libro no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message === 'El libro no tiene versión digital disponible' ||
                error.message === 'El comprador ya posee este libro digital'
            ) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al adquirir el libro digital', errorDetails: error });
        }
    }

    public getPdf = async (req: Request, res: Response) => {
        const libroId = Number(req.params.libroId);
        const compradorId = Number(req.query.compradorId);

        if (isNaN(libroId) || isNaN(compradorId)) {
            return res.status(400).json({ error: 'libroId y compradorId son requeridos y deben ser números.' });
        }

        try {
            const nombreArchivo = await libroDigitalService.obtenerArchivoDigital(compradorId, libroId);
            const rutaArchivo = path.resolve('uploads', nombreArchivo);
            res.sendFile(rutaArchivo);
        } catch (error: any) {
            if (error.message === 'Acceso denegado: el comprador no posee este libro digital') {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === 'El libro no tiene archivo digital asociado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al obtener el PDF', errorDetails: error });
        }
    }
}
